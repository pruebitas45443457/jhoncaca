import React, { useState, useEffect } from 'react';
import './primera.css';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Perfil from './perfil'; // Agrega este import
import Ganancias from './barra/ganancias';
import Genealogia from './barra/geneologia/geneologia';
import Comprar from './barra/comprar/comprar';

function Sidebar({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">MN PRO</div>
      <nav>
        <ul>
          <li className={active === 'dashboard' ? 'active' : ''} onClick={() => onSelect('dashboard')}>
            <span role="img" aria-label="dashboard">🏠</span> Dashboard
          </li>
          <li className={active === 'network' ? 'active' : ''} onClick={() => onSelect('network')}>
            <span role="img" aria-label="ordenes">📦</span> Mis Órdenes
          </li>
          <li className={active === 'genealogia' ? 'active' : ''} onClick={() => onSelect('genealogia')}>
            <span role="img" aria-label="genealogia">🌳</span> Genealogía
          </li>
          <li className={active === 'ganancias' ? 'active' : ''} onClick={() => onSelect('ganancias')}>
            <span role="img" aria-label="ganancias">💰</span> Ganancias
          </li>
          <li className={active === 'comprar' ? 'active' : ''} onClick={() => onSelect('comprar')}>
            <span role="img" aria-label="comprar">🛒</span> Comprar
          </li>
          <li className={active === 'perfil' ? 'active' : ''} onClick={() => onSelect('perfil')}>
            <span role="img" aria-label="perfil">👤</span> Perfil
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function Topbar({ username }) {
  const initial = username ? username[0].toUpperCase() : "👤";
  return (
    <header className="topbar">
      <div className="topbar-userbox">
        <div className="topbar-avatar">{initial}</div>
        <div className="topbar-username">{username || "Invitado"}</div>
      </div>
      <div className="topbar-title">Panel de Usuario</div>
    </header>
  );
}

function EnlacesPanel({ enlaces }) {
  const [copiado, setCopiado] = useState([false, false, false]);

  const copiarEnlace = (idx) => {
    navigator.clipboard.writeText(enlaces[idx]);
    setCopiado(prev => {
      const nuevo = [false, false, false];
      nuevo[idx] = true;
      setTimeout(() => setCopiado([false, false, false]), 1200);
      return nuevo;
    });
  };

  if (!enlaces || enlaces.length < 3) return null;
  return (
    <div style={{ width: "100%" }}>
      <div className="enlaces-panel">
        <div className="enlace-card left">
          <h4>Invitación Izquierda</h4>
          <a href={enlaces[1]} target="_blank" rel="noopener noreferrer">{enlaces[1]}</a>
          <button className="copy-btn" onClick={() => copiarEnlace(1)}>
            {copiado[1] ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
        <div className="enlace-card right">
          <h4>Invitación Derecha</h4>
          <a href={enlaces[0]} target="_blank" rel="noopener noreferrer">{enlaces[0]}</a>
          <button className="copy-btn" onClick={() => copiarEnlace(0)}>
            {copiado[0] ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
        <div className="enlace-card tienda">
          <h4>Tienda</h4>
          <a href={enlaces[2]} target="_blank" rel="noopener noreferrer">{enlaces[2]}</a>
          <button className="copy-btn" onClick={() => copiarEnlace(2)}>
            {copiado[2] ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem" }}>
        <a
          href="https://tumanual.com" // Cambia por tu enlace real
          target="_blank"
          rel="noopener noreferrer"
          className="manual-btn"
        >
          📖 Manual de uso
        </a>
      </div>
    </div>
  );
}

function Primera() {
  const [active, setActive] = useState('dashboard');
  const [enlaces, setEnlaces] = useState([]);
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchEnlaces = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEnlaces(data.enlaces || []);
          setUsername(data.username || user.displayName || "Usuario");
          setUserData({
            email: user.email,
            username: data.username || user.displayName || "Usuario",
            creationTime: user.metadata?.creationTime,
          });
        }
      }
    };
    fetchEnlaces();
  }, []);

  return (
    <div className="layout">
      <Sidebar active={active} onSelect={setActive} />
      <div className="main-content">
        <Topbar username={username} />
        <div className="content">
          {active === 'dashboard' && (
            <>
              <h2>Bienvenido a tu Dashboard</h2>
              <EnlacesPanel enlaces={enlaces} />
            </>
          )}
          {active === 'network' && <h2>Tu Red de Referidos</h2>}
          {active === 'genealogia' && <Genealogia />}
          {active === 'ganancias' && <Ganancias />}
          {active === 'perfil' && <Perfil userData={userData} />}
          {active === 'comprar' && <Comprar />}
        </div>
      </div>
    </div>
  );
}

export default Primera;