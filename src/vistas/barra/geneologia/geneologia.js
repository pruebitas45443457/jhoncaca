import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import './geneologia.css';

function Genealogia() {
  const [usuario, setUsuario] = useState(null);
  const [izquierda, setIzquierda] = useState([]);
  const [derecha, setDerecha] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [expandedMembers, setExpandedMembers] = useState(new Set());
  const [stats, setStats] = useState({
    totalReferidos: 0,
    izquierdaCount: 0,
    derechaCount: 0,
    gananciasIzquierda: 0,
    gananciasDerechas: 0,
    totalGanancias: 0
  });

  // Función para generar enlaces de invitación
  const generateInviteLink = (branch) => {
    const user = auth.currentUser;
    if (!user) return '';
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/registro?ref=${user.uid}&lado=${branch}`;
  };

  // Función para copiar enlace al portapapeles
  const copyInviteLink = async (branch) => {
    const link = generateInviteLink(branch);
    try {
      await navigator.clipboard.writeText(link);
      alert(`Enlace de ${branch} copiado al portapapeles!`);
    } catch (err) {
      console.error('Error al copiar:', err);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`Enlace de ${branch} copiado al portapapeles!`);
    }
  };

  // Función para filtrar miembros por búsqueda
  const filterMembers = (members) => {
    if (!searchTerm) return members;
    return members.filter(member => 
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Función para calcular ganancias estimadas
  const calculateEarnings = (count) => {
    // Ejemplo: $10 por referido directo
    return count * 10;
  };

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    const allMembers = [...izquierda, ...derecha];
    const csvContent = [
      ['Nombre', 'Email', 'Rama', 'Fecha Registro', 'Posición'],
      ...allMembers.map((member, index) => [
        member.username,
        member.email,
        member.lado,
        member.fechaRegistro,
        index + 1
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-red-genealogia.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Función para obtener sub-referidos de un miembro
  const fetchSubReferidos = async (memberId) => {
    try {
      const subQuery = query(
        collection(db, "users"), 
        where("referidoPor", "==", memberId)
      );
      const subSnap = await getDocs(subQuery);
      return subSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener sub-referidos:', error);
      return [];
    }
  };

  // Función para expandir/contraer miembros
  const toggleMemberExpansion = async (memberId) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
      // Aquí podrías cargar los sub-referidos si es necesario
    }
    setExpandedMembers(newExpanded);
  };

  useEffect(() => {
    const fetchGenealogia = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Obtén datos del usuario actual
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          setLoading(false);
          return;
        }
        
        const data = docSnap.data();
        setUsuario({ 
          username: data.username, 
          email: data.email,
          fechaRegistro: data.fechaRegistro || "No disponible"
        });

        // Busca invitados por campo "referidoPor"
        const invitadosRef = collection(db, "users");
        const q = query(invitadosRef, where("referidoPor", "==", user.uid));
        const querySnap = await getDocs(q);

        const izq = [];
        const der = [];
        
        querySnap.forEach(docu => {
          const d = docu.data();
          const lado = (d.lado || "").toLowerCase().trim();
          
          const userData = {
            id: docu.id,
            username: d.username,
            email: d.email,
            fechaRegistro: d.fechaRegistro || "No disponible",
            lado: d.lado
          };

          if (lado === "izquierda") {
            izq.push(userData);
          } else if (lado === "derecha") {
            der.push(userData);
          }
        });

        setIzquierda(izq);
        setDerecha(der);
        setStats({
          totalReferidos: izq.length + der.length,
          izquierdaCount: izq.length,
          derechaCount: der.length
        });

      } catch (error) {
        console.error("Error al cargar genealogía:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGenealogia();
  }, []);

  if (loading) {
    return (
      <div className="genealogia-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tu red...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genealogia-container">
      {/* Header con estadísticas */}
      <div className="genealogia-header">
        <h2>🌳 Mi Red de Referidos</h2>
        <div className="stats-cards">
          <div className="stat-card total">
            <div className="stat-number">{stats.totalReferidos}</div>
            <div className="stat-label">Total Referidos</div>
            <div className="stat-extra">${calculateEarnings(stats.totalReferidos)} estimados</div>
          </div>
          <div className="stat-card izquierda">
            <div className="stat-number">{stats.izquierdaCount}</div>
            <div className="stat-label">Rama Izquierda</div>
            <div className="stat-extra">${calculateEarnings(stats.izquierdaCount)}</div>
          </div>
          <div className="stat-card derecha">
            <div className="stat-number">{stats.derechaCount}</div>
            <div className="stat-label">Rama Derecha</div>
            <div className="stat-extra">${calculateEarnings(stats.derechaCount)}</div>
          </div>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="genealogia-toolbar">
        <div className="toolbar-left">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Buscar en tu red..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="toolbar-right">
          <button 
            className="toolbar-btn invite-btn"
            onClick={() => {
              setSelectedBranch('izquierda');
              setShowInviteModal(true);
            }}
          >
            📤 Invitar Izquierda
          </button>
          <button 
            className="toolbar-btn invite-btn"
            onClick={() => {
              setSelectedBranch('derecha');
              setShowInviteModal(true);
            }}
          >
            📤 Invitar Derecha
          </button>
          <button 
            className="toolbar-btn export-btn"
            onClick={exportToCSV}
          >
            📊 Exportar CSV
          </button>
        </div>
      </div>

      {/* Árbol genealógico */}
      <div className="genealogia-tree">
        {/* Usuario principal */}
        <div className="tree-level user-level">
          <div className="user-node main-user">
            <div className="user-avatar main">
              {usuario?.username?.[0]?.toUpperCase() || "👤"}
            </div>
            <div className="user-info">
              <div className="user-name">{usuario?.username || "Usuario"}</div>
              <div className="user-email">{usuario?.email}</div>
              <div className="user-role">👑 Líder de Red</div>
            </div>
            <div className="connection-lines">
              <div className="line-left"></div>
              <div className="line-right"></div>
            </div>
          </div>
        </div>

        {/* Ramas izquierda y derecha */}
        <div className="tree-level branches-level">
          {/* Rama Izquierda */}
          <div className="branch-container left-branch">
            <div className="branch-header">
              <h3>🌿 Rama Izquierda</h3>
              <span className="branch-count">{stats.izquierdaCount} miembros</span>
            </div>
            
            <div className="branch-content">
              {filterMembers(izquierda).length === 0 ? (
                <div className="empty-branch">
                  <div className="empty-icon">🌱</div>
                  <p>{searchTerm ? 'No se encontraron resultados' : 'Aún no tienes referidos en esta rama'}</p>
                  <div className="invite-link">
                    <button 
                      className="invite-link-btn"
                      onClick={() => copyInviteLink('izquierda')}
                    >
                      📋 Copiar enlace de invitación
                    </button>
                  </div>
                </div>
              ) : (
                <div className="members-grid">
                  {filterMembers(izquierda).map((member, index) => (
                    <div key={member.id} className="member-card">
                      <div className="member-avatar">
                        {member.username?.[0]?.toUpperCase() || "👤"}
                      </div>
                      <div className="member-info">
                        <div className="member-name">{member.username}</div>
                        <div className="member-email">{member.email}</div>
                        <div className="member-date">
                          📅 {member.fechaRegistro}
                        </div>
                      </div>
                      <div className="member-actions">
                        <div className="member-position">#{index + 1}</div>
                        <button 
                          className="expand-btn"
                          onClick={() => toggleMemberExpansion(member.id)}
                        >
                          {expandedMembers.has(member.id) ? '▼' : '▶'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rama Derecha */}
          <div className="branch-container right-branch">
            <div className="branch-header">
              <h3>🌿 Rama Derecha</h3>
              <span className="branch-count">{stats.derechaCount} miembros</span>
            </div>
            
            <div className="branch-content">
              {filterMembers(derecha).length === 0 ? (
                <div className="empty-branch">
                  <div className="empty-icon">🌱</div>
                  <p>{searchTerm ? 'No se encontraron resultados' : 'Aún no tienes referidos en esta rama'}</p>
                  <div className="invite-link">
                    <button 
                      className="invite-link-btn"
                      onClick={() => copyInviteLink('derecha')}
                    >
                      📋 Copiar enlace de invitación
                    </button>
                  </div>
                </div>
              ) : (
                <div className="members-grid">
                  {filterMembers(derecha).map((member, index) => (
                    <div key={member.id} className="member-card">
                      <div className="member-avatar">
                        {member.username?.[0]?.toUpperCase() || "👤"}
                      </div>
                      <div className="member-info">
                        <div className="member-name">{member.username}</div>
                        <div className="member-email">{member.email}</div>
                        <div className="member-date">
                          📅 {member.fechaRegistro}
                        </div>
                      </div>
                      <div className="member-actions">
                        <div className="member-position">#{index + 1}</div>
                        <button 
                          className="expand-btn"
                          onClick={() => toggleMemberExpansion(member.id)}
                        >
                          {expandedMembers.has(member.id) ? '▼' : '▶'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="genealogia-footer">
        <div className="balance-info">
          <h4>📊 Balance de Red</h4>
          <div className="balance-visual">
            <div className="balance-bar">
              <div 
                className="balance-fill left"
                style={{ 
                  width: stats.totalReferidos > 0 
                    ? `${(stats.izquierdaCount / stats.totalReferidos) * 100}%` 
                    : '50%' 
                }}
              ></div>
              <div 
                className="balance-fill right"
                style={{ 
                  width: stats.totalReferidos > 0 
                    ? `${(stats.derechaCount / stats.totalReferidos) * 100}%` 
                    : '50%' 
                }}
              ></div>
            </div>
            <div className="balance-labels">
              <span>Izquierda: {stats.izquierdaCount}</span>
              <span>Derecha: {stats.derechaCount}</span>
            </div>
          </div>
        </div>

        <div className="tips-section">
          <h4>💡 Consejos para hacer crecer tu red</h4>
          <ul>
            <li>Mantén un balance entre ambas ramas para maximizar tus ganancias</li>
            <li>Comparte tus enlaces de invitación en redes sociales</li>
            <li>Apoya a tus referidos para que también crezcan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Genealogia;