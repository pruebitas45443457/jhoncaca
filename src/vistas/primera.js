import React, { useState, useEffect } from 'react';
import './primera.css';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Perfil from './perfil'; // Agrega este import
import Ganancias from './barra/ganancias';
import Genealogia from './barra/geneologia/geneologia';
import Comprar from './barra/comprar/comprar';
import Ordenes from './barra/ordenes/ordenes'; // Agrega este import

import DataAdmin from '../private/datosAdmin';
import OrdenesGlobales from '../private/OrdenesGlobales';
import LimpiarOrdenesCompletadas from '../private/LimpiarOrdenesCompletadas';


function generarEnlace(uid) {
  const base = uid;
  const host = window.location.origin; // toma http://localhost:3000 o https://miapp.com
  return [
    //geneologia Derecha
    `${host}/invitadoR/${base}`,

    //geneologia Izquierda
    `${host}/invitadoL/${base}`,

    //link de tienda-> shop
    `${host}/L_Shop/${base}`
  ];
}








function Sidebar({ active, onSelect, user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">MN PRO</div>
      <nav>
        <ul>
          <li className={active === 'dashboard' ? 'active' : ''} onClick={() => onSelect('dashboard')}>
            🏠 {user?.referencia === 2 ? "Admin Panel" : "Dashboard"}
          </li>

          {user?.referencia === 2 ? (
            <>
              <li className={active === 'ordenesGlobales' ? 'active' : ''} onClick={() => onSelect('ordenesGlobales')}>
                🧾 Ordenes Globales
              </li>
              {/* Agrega más opciones de admin si quieres */}

            </>
          ) : (
            <>
              <li className={active === 'network' ? 'active' : ''} onClick={() => onSelect('network')}>
                📦 Mis Órdenes
              </li>
              <li className={active === 'genealogia' ? 'active' : ''} onClick={() => onSelect('genealogia')}>
                🌳 Genealogía
              </li>
              <li className={active === 'ganancias' ? 'active' : ''} onClick={() => onSelect('ganancias')}>
                💰 Ganancias
              </li>
              <li className={active === 'comprar' ? 'active' : ''} onClick={() => onSelect('comprar')}>
                🛒 Comprar
              </li>
              <li className={active === 'perfil' ? 'active' : ''} onClick={() => onSelect('perfil')}>
                👤 Perfil
              </li>
            </>
          )}
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
  const Manual = () => {
    window.location.href = "/manual";

  };

  const copiarEnlace = (idx) => {
    navigator.clipboard.writeText(enlaces[idx]);
    setCopiado(prev => {
      const nuevo = [false, false, false];
      nuevo[idx] = true;
      setTimeout(() => setCopiado([false, false, false]), 1200);
      return nuevo;
    });
  };

  if (!enlaces || enlaces.length < 3) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
        <p>Generando tus enlaces personalizados...</p>
        <p>Por favor, recarga la página si no aparecen en unos segundos.</p>
      </div>
    );
  }
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
       <button
          onClick={Manual}
          className="manual-btn"
        >
          📖 Manual de uso
        </button>
      </div>
    </div>
  );
}

function Primera({ user }) {
  const [active, setActive] = useState('dashboard');
  const [enlaces, setEnlaces] = useState([]);
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchEnlaces = async () => {
      const userAuth = auth.currentUser;
      if (userAuth) {
        const docRef = doc(db, "users", userAuth.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          console.log("Datos del usuario desde Firestore:", data);
          console.log("Enlaces encontrados:", data.enlaces);
          
          // Verificar si los enlaces existen y tienen la longitud correcta
          let enlacesActualizados = data.enlaces || [];
          
          if (!enlacesActualizados || enlacesActualizados.length < 3) {
            console.log("Enlaces faltantes o incompletos, generando nuevos...");
            enlacesActualizados = generarEnlace(user.uid);
            
            // Actualizar en Firestore
            try {
              await setDoc(docRef, { ...data, enlaces: enlacesActualizados }, { merge: true });
              console.log("Enlaces actualizados en Firestore:", enlacesActualizados);
            } catch (error) {
              console.error("Error al actualizar enlaces:", error);
            }
          }
          
          setEnlaces(enlacesActualizados);
          setUsername(data.username || user.displayName || "Usuario");
        

          setUserData({
            email: userAuth.email,
            username: data.username || userAuth.displayName || "Usuario",
            creationTime: userAuth.metadata?.creationTime,
          });
        } else {
          console.log("No se encontró el documento del usuario");
        }
      } else {
        console.log("No hay usuario autenticado");
      }
    };
    fetchEnlaces();
  }, []);

  return (
    <div className="layout">
      <LimpiarOrdenesCompletadas />
      {/* Resto de tu app */}
      <Sidebar  user={user} active={active} onSelect={setActive} />
      <div className="main-content">
        <Topbar username={username} />
        <div className="content">
          {/* Admin */}
          {user?.referencia === 2 && (
            <>
              {active === 'dashboard' && <DataAdmin user={user} /> }
              {active === 'ordenesGlobales' && <OrdenesGlobales user={user} />}
              {/* Puedes agregar más componentes admin aquí */}
            </>
          )}

          {/* Usuario normal */}
          {user?.referencia !== 2 && (
            <>
              {active === 'dashboard' && (
                <>
                  <h2>Bienvenido a tu Dashboard</h2>
                  <EnlacesPanel enlaces={enlaces} />

                </>
              )}
              {active === 'network' && <Ordenes />}
              {active === 'genealogia' && <Genealogia />}
              {active === 'ganancias' && <Ganancias />}
              {active === 'perfil' && <Perfil userData={userData} />}
              {active === 'comprar' && <Comprar />}
            </>
          )}

          {active === 'network' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>Mis Órdenes</h2>
              <p>Accede a la tienda para ver y gestionar tus órdenes</p>
              <button 
                className="advanced-btn"
                onClick={() => window.location.href = '/usuario/principal2'}
                style={{ 
                  padding: '1rem 2rem', 
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #0074D9 0%, #005fa3 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🛒 Ir a la Tienda
              </button>
            </div>
          )}
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