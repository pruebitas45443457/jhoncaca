import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Registro from './vistas/registro';
import Login from './vistas/login';
import Primera from './vistas/primera';
import Home2 from './vistas/usuario/home2';
import Producto from './vistas/usuario/producto';
import Principal2 from './vistas/usuario/principal2'; // Asegúrate de importar el componente

function Navbar({ user, onLogout, onShowLogin, onShowRegister }) {
  return (
    <nav className="navbar">
      <span className="logo advanced-logo">
        <svg width="36" height="36" viewBox="0 0 36 36" style={{verticalAlign: 'middle', marginRight: 8}}>
          <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2196f3"/>
              <stop offset="100%" stopColor="#0d47a1"/>
            </linearGradient>
          </defs>
          <circle cx="18" cy="18" r="16" fill="url(#logo-gradient)" />
          <text x="50%" y="58%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="Segoe UI">AMJ</text>
        </svg>
        AMJ
      </span>
      <div className="navbar-links">
        <a className="navbar-link" href="/">Inicio</a>
        <a className="navbar-link" href="/usuario/home2">Panel</a>
        <a className="navbar-link" href="#beneficios">Beneficios</a>
        <a className="navbar-link" href="#testimonios">Testimonios</a>
        <a className="navbar-link" href="#contacto">Contacto</a>
        {user ? (
          <>
            <span className="welcome advanced-welcome">👋 Hola, {user.username}</span>
            <button className="advanced-btn" onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <div className="navbar-auth">
            <button className="navbar-login-btn" onClick={onShowLogin}>Login</button>
            <button className="navbar-register-btn" onClick={onShowRegister}>Register</button>
          </div>
        )}
      </div>
    </nav>
  );
}

function HomeContent({ user }) {
  return (
    <main className="amj-minimal-bg">
      <section className="amj-minimal-hero">
        <div className="amj-minimal-hero-left">
          <h1>
            Bienvenido a <span className="amj-minimal-gradient">AMJ</span>
          </h1>
          <p>
            Impulsa tu crecimiento personal y profesional.<br />
            Comunidad, herramientas y apoyo para alcanzar tus metas.
          </p>
          {!user && (
            <button
              className="amj-minimal-btn"
              onClick={() => window.location.href = "/usuario/home2"}
            >
              Explorar mi panel
            </button>
          )}
        </div>
      </section>

      <section className="amj-minimal-benefits">
        <h2>¿Por qué elegir AMJ?</h2>
        <div className="amj-minimal-benefits-grid">
          <div>
            <div className="amj-icon">
              <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="14" stroke="#2196f3" strokeWidth="2"/><circle cx="16" cy="13" r="5" fill="#2196f3"/></svg>
            </div>
            <h3>Panel claro</h3>
            <p>Visualiza tu red y ganancias en tiempo real.</p>
          </div>
          <div>
            <div className="amj-icon">
              <svg width="32" height="32" fill="none"><rect x="6" y="10" width="20" height="12" rx="6" stroke="#2196f3" strokeWidth="2"/><path d="M16 14v4" stroke="#2196f3" strokeWidth="2"/></svg>
            </div>
            <h3>Invitaciones simples</h3>
            <p>Haz crecer tu equipo con enlaces únicos.</p>
          </div>
          <div>
            <div className="amj-icon">
              <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="14" stroke="#2196f3" strokeWidth="2"/><path d="M16 10v8l5 3" stroke="#2196f3" strokeWidth="2"/></svg>
            </div>
            <h3>Soporte real</h3>
            <p>Ayuda y recursos siempre disponibles.</p>
          </div>
        </div>
      </section>

      <section className="amj-minimal-comments">
        <h2>Testimonios</h2>
        <div className="amj-minimal-comments-grid">
          <div>
            <p>"AMJ me ayudó a crecer mi red y mis ingresos."</p>
            <span>- Laura G.</span>
          </div>
          <div>
            <p>"El panel es intuitivo y el soporte responde."</p>
            <span>- Carlos M.</span>
          </div>
          <div>
            <p>"Ahora tengo un equipo motivado y unido."</p>
            <span>- Sofía R.</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowRegister(false);
  };

  const handleLogout = () => setUser(null);

  return (
    <Router>
      <div className="App">
        <div className="navbar-bg">
          <Navbar
            user={user}
            onLogout={handleLogout}
            onShowLogin={() => { setShowLogin(true); setShowRegister(false); }}
            onShowRegister={() => { setShowRegister(true); setShowLogin(false); }}
          />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Primera />
              ) : showLogin ? (
                <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
              ) : showRegister ? (
                <Registro onRegister={handleRegister} onCancel={() => setShowRegister(false)} />
              ) : (
                <HomeContent user={user} />
              )
            }
          />
          <Route path="/usuario/home2" element={<Home2 />} />
          <Route path="/producto/:nombre" element={<Producto />} />
          <Route path="/usuario/principal2" element={<Principal2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
