import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Registro from './vistas/auth/registro';
import Login from './vistas/auth/login';
import Primera from './vistas/primera';
import Home2 from './vistas/usuario/home2';
import Producto from './vistas/usuario/producto';
import Principal2 from './vistas/usuario/principal2'; // Asegúrate de importar el componente
import Perfil from "./vistas/usuario/perfil";
import InvitadoR from './vistas/links/invitacionRigth'; // Asegúrate de importar el componente Invitado
import InvitadoL from './vistas/links/invitacionLeft'; // Asegúrate de importar el componente Invitado
import ShopL from './vistas/links/LinkTienda'; // Asegúrate de importar el componente Invitado
import Manual from './vistas/manual/manual'; // Asegúrate de importar el componente Manual

import Admin from './private/indexAdmin'; // Asegúrate de importar el componente Admin

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
        
        <div className="navbar-links">
      {user ? (
        <>
          <a className="navbar-link" href="#testimonios">Testimonios</a>
          <a className="navbar-link" href="#contacto">Contacto</a>

          {/* Solo para usuarios con referencia === 2 */}
          {user.referencia === 2 && (
            <a className="navbar-link" href="/admin">Admin</a>
          )}

          <span className="welcome advanced-welcome">👋 Hola, {user.username}</span>
          <button className="advanced-btn" onClick={onLogout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <a className="navbar-link" href="/">Inicio</a>
          <a className="navbar-link" href="#beneficios">Beneficios</a>
          <a className="navbar-link" href="#testimonios">Testimonios</a>
          <a className="navbar-link" href="/usuario/home2">Panel</a>
          <a className="navbar-link" href="#contacto">Contacto</a>

          <div className="navbar-auth">
            <button className="navbar-login-btn" onClick={onShowLogin}>iniciar sesion </button>
            <button className="navbar-register-btn" onClick={onShowRegister}>Registrate</button>
          </div>
        </>
      )}
    </div>

      </div>
    </nav>
  );
}

function HomeContent({ user }) {
  const [counters, setCounters] = React.useState({
    users: 0,
    earnings: 0,
    teams: 0
  });

  React.useEffect(() => {
    const animateCounters = () => {
      const targets = { users: 15420, earnings: 2847, teams: 892 };
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounters({
          users: Math.floor(targets.users * progress),
          earnings: Math.floor(targets.earnings * progress),
          teams: Math.floor(targets.teams * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    });

    const statsElement = document.querySelector('.stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="amj-minimal-bg">
      <section className="amj-minimal-hero">
        <div className="amj-minimal-hero-left">
          <h1>
            Bienvenido a <span className="amj-minimal-gradient">AMJ</span>
          </h1>
          <p id='beneficios'>
            Impulsa tu crecimiento personal y profesional.<br />
            Comunidad, herramientas y apoyo para alcanzar tus metas.
          </p>
          <div className="hero-badges">
            <span className="badge">🏆 #1 en Crecimiento</span>
            <span className="badge">⭐ 4.9/5 Valoración</span>
            <span className="badge">🔒 100% Seguro</span>
          </div>
          {!user && (
            <div className="hero-buttons">
              <button
                className="amj-minimal-btn primary"
                onClick={() => window.location.href = "/usuario/home2"}
              >
                Explorar mi panel
              </button>
            </div>
          )}
        </div>
        <div className="amj-minimal-hero-right">
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">💰</div>
              <div className="card-text">
                <span>Ganancias</span>
                <strong>+25%</strong>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">👥</div>
              <div className="card-text">
                <span>Equipo</span>
                <strong>+12 miembros</strong>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📈</div>
              <div className="card-text">
                <span>Crecimiento</span>
                <strong>+180%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de estadísticas */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{counters.users.toLocaleString()}</div>
            <div className="stat-label">Usuarios Activos</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">💰</div>
            <div className="stat-number">${counters.earnings.toLocaleString()}</div>
            <div className="stat-label">Ganancias Generadas</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">{counters.teams.toLocaleString()}</div>
            <div className="stat-label">Equipos Exitosos</div>
          </div>
        </div>
      </section>

      <section className="amj-minimal-benefits">
        <h2>¿Por qué elegir AMJ?</h2>
        <div className="amj-minimal-benefits-grid">
          <div className="benefit-card">
            <div className="amj-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                <circle cx="16" cy="13" r="5" fill="currentColor"/>
              </svg>
            </div>
            <h3>Panel claro</h3>
            <p>Visualiza tu red y ganancias en tiempo real con dashboards intuitivos.</p>
            <div className="benefit-features">
              <span>✓ Métricas en tiempo real</span>
              <span>✓ Gráficos interactivos</span>
              <span>✓ Reportes automáticos</span>
            </div>
          </div>
          <div className="benefit-card">
            <div className="amj-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                <rect x="6" y="10" width="20" height="12" rx="6" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 14v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Invitaciones simples</h3>
            <p>Haz crecer tu equipo con enlaces únicos y herramientas de seguimiento.</p>
            <div className="benefit-features">
              <span>✓ Enlaces personalizados</span>
              <span>✓ Seguimiento de conversiones</span>
              <span>✓ Automatización inteligente</span>
            </div>
          </div>
          <div className="benefit-card">
            <div className="amj-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 10v8l5 3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Soporte real</h3>
            <p>Ayuda y recursos siempre disponibles con nuestro equipo especializado.</p>
            <div className="benefit-features">
              <span>✓ Chat 24/7</span>
              <span>✓ Capacitación gratuita</span>
              <span>✓ Comunidad activa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección de proceso */}
      <section className="process-section">
        <h2>Cómo funciona</h2>
        <div className="process-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Regístrate</h3>
              <p>Crea tu cuenta en menos de 2 minutos</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Invita</h3>
              <p>Comparte tu enlace único con otros</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Gana</h3>
              <p>Recibe comisiones por cada referido exitoso</p>
            </div>
          </div>
        </div>
      </section>

      <section className="amj-minimal-comments">
        <h2>Lo que dicen nuestros usuarios</h2>
        <div className="amj-minimal-comments-grid">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%230074D9'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3EL%3C/text%3E%3C/svg%3E" alt="Laura" />
              </div>
              <div className="testimonial-info">
                <strong>Laura García</strong>
                <span>Líder de Equipo</span>
              </div>
              <div className="rating">⭐⭐⭐⭐⭐</div>
            </div>
            <p>"AMJ me ayudó a crecer mi red y mis ingresos de manera exponencial. La plataforma es increíblemente fácil de usar."</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23005fa3'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3EC%3C/text%3E%3C/svg%3E" alt="Carlos" />
              </div>
              <div className="testimonial-info">
                <strong>Carlos Mendoza</strong>
                <span>Emprendedor</span>
              </div>
              <div className="rating">⭐⭐⭐⭐⭐</div>
            </div>
            <p>"El panel es intuitivo y el soporte responde inmediatamente. He logrado resultados que nunca pensé posibles."</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%230074D9'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3ES%3C/text%3E%3C/svg%3E" alt="Sofia" />
              </div>
              <div className="testimonial-info">
                <strong>Sofía Rodríguez</strong>
                <span>Coach de Ventas</span>
              </div>
              <div className="rating">⭐⭐⭐⭐⭐</div>
            </div>
            <p id='testimonios'>"Ahora tengo un equipo motivado y unido. Las herramientas de AMJ han transformado mi negocio completamente."</p>
          </div>
        </div>
      </section>

      {/* Nueva sección de contacto */}
      <section className="contact-section" id="contacto">
        <div className="contact-container">
          <div className="contact-info">
            <h2>¿Listo para comenzar?</h2>
            <p>Únete a miles de usuarios que ya están creciendo con AMJ</p>
            <div className="contact-features">
              <div className="contact-feature">
                <span className="feature-icon">🚀</span>
                <span>Inicio rápido en 5 minutos</span>
              </div>
              <div className="contact-feature">
                <span className="feature-icon">💡</span>
                <span>Soporte personalizado</span>
              </div>
              <div className="contact-feature">
                <span className="feature-icon">📊</span>
                <span>Resultados garantizados</span>
              </div>
            </div>
          </div>
          <div className="contact-cta">
            <h3>Comienza tu crecimiento hoy</h3>
            <p>Más de 15,000 usuarios confían en AMJ para hacer crecer sus negocios</p>
            <div className="cta-buttons">
              <button 
                className="cta-btn primary"
                onClick={() => window.location.href = "/usuario/home2"}
              >
                Comenzar ahora
              </button>
              <button className="cta-btn secondary">
                Contactar soporte
              </button>
            </div>
            <div className="trust-indicators">
              <span>✓ Sin costos ocultos</span>
              <span>✓ Soporte 24/7</span>
              <span>✓ Resultados garantizados</span>
            </div>
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

  // Efecto para el cursor personalizado
  React.useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
    };

    document.addEventListener('mousemove', moveCursor);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
    };
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Elementos decorativos del fondo */}
        <div className="floating-elements">
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
        </div>
        
        <div className="wave-container">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>

        <div className="navbar-bg">
          <Navbar
            user={user}
            onLogout={handleLogout}
            onShowLogin={() => { setShowLogin(true);setShowRegister(false) }}
            onShowRegister={() => { setShowRegister(true); setShowLogin(false)  }}
          />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.referencia === 2 ? (
                  <Navigate to="/admin" />
                ) : (
                  <Primera />
                )
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
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/invitadoR/:id" element={<InvitadoR />} />
          <Route path="/invitadoL/:id" element={<InvitadoL />} />
          <Route path="/L_Shop/:id" element={<ShopL/>} />
          <Route path="/manual" element={<Manual/>} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />

          
            <Route
              path="/admin"
              element={
                user?.referencia === 2 ? (
                  <Admin user={user} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />


          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
