import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./home2.css";
import Carrito from "./carro/carrito";

const productos = [
  {
    nombre: "Suplemento Premium",
    descripcion: "Mejora tu energía y bienestar con ingredientes naturales.",
    precio: 29.99,
    imagen:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    calificacion: 4.7,
    stock: 12,
    envioGratis: true,
  },
  {
    nombre: "Proteína Vegana",
    descripcion: "Ideal para recuperación muscular y dietas saludables.",
    precio: 39.99,
    imagen:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80",
    calificacion: 4.5,
    stock: 5,
    envioGratis: false,
  },
  {
    nombre: "Vitaminas Complejas",
    descripcion: "Refuerza tu sistema inmune con vitaminas esenciales.",
    precio: 19.99,
    imagen:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    calificacion: 4.8,
    stock: 0,
    envioGratis: true,
  },
  {
    nombre: "Bebida Detox",
    descripcion: "Limpia tu organismo y siente la diferencia.",
    precio: 24.99,
    imagen:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    calificacion: 4.3,
    stock: 8,
    envioGratis: false,
  },
];

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= Math.round(rating) ? "#ffd600" : "#e0e0e0",
          fontSize: 18,
        }}
      >
        ★
      </span>
    );
  }
  return stars;
}

function Principal2() {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState(() => {
    // Recupera el carrito del localStorage al cargar
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const mainRef = useRef(null);
  const navigate = useNavigate();

  // Guarda el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Scroll al top al cambiar de vista principal
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo
        ? mainRef.current.scrollTo(0, 0)
        : window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [mostrarCarrito, mostrarPerfil]);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  function agregarAlCarrito(producto) {
    // Si ya existe, suma cantidad
    setCarrito((prev) => {
      const existe = prev.find((p) => p.nombre === producto.nombre);
      if (existe) {
        return prev.map((p) =>
          p.nombre === producto.nombre
            ? { ...p, cantidad: (p.cantidad || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function quitarDelCarrito(index) {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  }

  function totalCarrito() {
    return carrito.reduce(
      (acc, prod) => acc + prod.precio * (prod.cantidad || 1),
      0
    ).toFixed(2);
  }

  // Para pasar props y lógica avanzada al Carrito.js
  function handleVaciarCarrito() {
    setCarrito([]);
  }
  function handleEliminarProducto(id) {
    setCarrito(carrito.filter((prod) => prod.nombre !== id));
  }
  function handleCambiarCantidad(id, cantidad) {
    setCarrito(
      carrito.map((prod) =>
        prod.nombre === id
          ? { ...prod, cantidad: Math.max(1, cantidad) }
          : prod
      )
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e3f2fd 60%, #fff 100%)",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* Barra lateral minimalista avanzada */}
      <aside
        style={{
          width: 80,
          background: "rgba(25, 118, 210, 0.98)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1.5rem 0 1.5rem 0",
          borderRadius: "0 2.2rem 2.2rem 0",
          boxShadow: "8px 0 32px #1976d244",
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 30,
          borderRight: "2.5px solid #e3f2fd",
          transition: "box-shadow 0.3s",
          gap: 22,
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Logo animado */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fff 60%, #e3f2fd 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            boxShadow: "0 2px 16px #2196f344",
            border: "2px solid #2196f3",
            animation: "spinLogo 2.5s linear infinite alternate",
          }}
        >
          <span style={{ fontSize: 32, color: "#1976d2", fontWeight: 900 }}>
            🛍️
          </span>
        </div>
        {/* Navegación minimalista avanzada */}
        <nav style={{ width: "100%" }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
            }}
          >
            <li
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background:
                  !mostrarPerfil && !mostrarCarrito ? "#fff4" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 27,
                color: !mostrarPerfil && !mostrarCarrito ? "#1976d2" : "#e3f2fd",
                boxShadow:
                  !mostrarPerfil && !mostrarCarrito ? "0 2px 12px #2196f366" : "none",
                border: "none",
                transition:
                  "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.18s",
                position: "relative",
              }}
              title="Productos"
              onClick={() => {
                setMostrarPerfil(false);
                setMostrarCarrito(false);
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ filter: "drop-shadow(0 2px 6px #2196f366)" }}>
                🏠
              </span>
              {!mostrarPerfil && !mostrarCarrito && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 10,
                    color: "#1976d2",
                    fontWeight: 700,
                    letterSpacing: 1,
                    opacity: 0.8,
                  }}
                >
                  Home
                </span>
              )}
            </li>
            <li
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: mostrarCarrito ? "#fff4" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 27,
                color: mostrarCarrito ? "#1976d2" : "#e3f2fd",
                boxShadow: mostrarCarrito ? "0 2px 12px #2196f366" : "none",
                border: "none",
                position: "relative",
                transition:
                  "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.18s",
              }}
              title="Carrito"
              onClick={() => {
                setMostrarPerfil(false);
                setMostrarCarrito(true);
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ filter: "drop-shadow(0 2px 6px #2196f366)" }}>
                🛒
              </span>
              {carrito.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    background: "#fff",
                    color: "#2196f3",
                    borderRadius: "50%",
                    padding: "0 7px",
                    fontWeight: 700,
                    fontSize: 13,
                    boxShadow: "0 1px 6px #2196f322",
                    minWidth: 20,
                    textAlign: "center",
                    lineHeight: "20px",
                    border: "1.5px solid #2196f3",
                  }}
                >
                  {carrito.length}
                </span>
              )}
              {mostrarCarrito && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 10,
                    color: "#1976d2",
                    fontWeight: 700,
                    letterSpacing: 1,
                    opacity: 0.8,
                  }}
                >
                  Carrito
                </span>
              )}
            </li>
            <li
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: mostrarPerfil ? "#fff4" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 27,
                color: mostrarPerfil ? "#1976d2" : "#e3f2fd",
                boxShadow: mostrarPerfil ? "0 2px 12px #2196f366" : "none",
                border: "none",
                transition:
                  "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.18s",
                position: "relative",
              }}
              title="Perfil"
              onClick={() => navigate("/perfil")}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ filter: "drop-shadow(0 2px 6px #2196f366)" }}>
                👤
              </span>
              {mostrarPerfil && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 10,
                    color: "#1976d2",
                    fontWeight: 700,
                    letterSpacing: 1,
                    opacity: 0.8,
                  }}
                >
                  Perfil
                </span>
              )}
            </li>
          </ul>
        </nav>
        {/* Footer minimalista */}
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            textAlign: "center",
            color: "#e3f2fd",
            fontSize: 11,
            opacity: 0.7,
            padding: "0.7rem 0 0.2rem 0",
            letterSpacing: 1,
            fontWeight: 500,
          }}
        >
          <span>© {new Date().getFullYear()}</span>
        </div>
        <style>
          {`
        @keyframes spinLogo {
          0% { transform: rotate(-6deg);}
          100% { transform: rotate(6deg);}
        }
        `}
        </style>
      </aside>

      {/* Contenido principal desplazado */}
      <main
        ref={mainRef}
        style={{
          flex: 1,
          padding: "1.2rem 2rem 2.5rem 2rem",
          marginLeft: 80,
          width: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {/* Barra de búsqueda y usuario */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            className="productos-searchbar"
            style={{
              maxWidth: 420,
              width: "100%",
              background: "#fff",
              borderRadius: "2rem",
              boxShadow: "0 2px 12px #2196f322",
              border: "1.5px solid #e3f2fd",
              padding: "0.5rem 1.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: "1.15rem",
                color: "#1565c0",
                outline: "none",
                padding: "0.5rem 0.7rem",
              }}
            />
            <span
              className="search-icon"
              style={{
                color: "#2196f3",
                fontSize: "1.4rem",
                marginLeft: 8,
              }}
            >
              🔍
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <button
              className="home-usuario-btn-sec"
              style={{ padding: "0.7rem 1.5rem" }}
              onClick={() => setMostrarPerfil(true)}
            >
              👤 Mi Perfil
            </button>
            <button
              className="home-usuario-btn"
              style={{ padding: "0.7rem 1.5rem" }}
              onClick={() => setMostrarCarrito(true)}
            >
              🛒 Carrito ({carrito.length})
            </button>
          </div>
        </div>

        {/* Vista de perfil */}
        {mostrarPerfil && (
          <div
            style={{
              background: "#fff",
              borderRadius: "1.5rem",
              boxShadow: "0 4px 24px #2196f322",
              padding: "2.5rem 2rem",
              maxWidth: 520,
              margin: "0 auto",
              color: "#1565c0",
              fontSize: 18,
            }}
          >
            <h2 style={{ color: "#2196f3", marginBottom: 18 }}>Mi Perfil</h2>
            <div style={{ marginBottom: 10 }}>
              👤 <b>usuario_demo</b>
            </div>
            <div style={{ marginBottom: 10 }}>
              ✉️ <b>usuario@demo.com</b>
            </div>
            <div style={{ marginTop: 28 }}>
              <button
                className="home-usuario-btn-sec"
                style={{ marginRight: 12 }}
              >
                Editar Perfil
              </button>
              <button className="home-usuario-btn">Cerrar Sesión</button>
            </div>
          </div>
        )}

        {/* Vista del carrito */}
        {mostrarCarrito && (
          <Carrito
            carrito={carrito}
            setCarrito={setCarrito}
            onVaciar={handleVaciarCarrito}
            onEliminar={handleEliminarProducto}
            onCambiarCantidad={handleCambiarCantidad}
            onCerrar={() => setMostrarCarrito(false)}
          />
        )}

        {/* Vista de productos */}
        {!mostrarPerfil && !mostrarCarrito && (
          <>
            <div
              className="productos-titulo"
              style={{ marginTop: 0, marginBottom: 18 }}
            >
              <h2
                style={{
                  color: "#1976d2",
                  fontWeight: 900,
                  fontSize: "2rem",
                }}
              >
                Productos Destacados
              </h2>
            </div>
            <div className="productos-grid" style={{ gap: 32 }}>
              {productosFiltrados.length === 0 && (
                <div
                  style={{
                    color: "#bdbdbd",
                    fontSize: 20,
                    marginTop: 40,
                  }}
                >
                  No se encontraron productos.
                </div>
              )}
              {productosFiltrados.map((prod, i) => (
                <div
                  className="producto-card"
                  key={i}
                  style={{
                    cursor: "pointer",
                    background: "#fff",
                    borderRadius: "1.5rem",
                    boxShadow: "0 2px 16px #2196f322",
                    padding: "1.2rem 1rem",
                    minWidth: 260,
                    maxWidth: 320,
                    transition:
                      "box-shadow 0.2s, transform 0.2s",
                    border: "1.5px solid #e3f2fd",
                    position: "relative",
                  }}
                  onClick={() =>
                    navigate(`/producto/${encodeURIComponent(prod.nombre)}`, {
                      state: { producto: prod,
                      },
                    })
                  }
                >
                  <div
                    className="producto-img"
                    style={{
                      backgroundImage: `url(${prod.imagen})`,
                      height: 170,
                      borderRadius: "1.2rem",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      marginBottom: 16,
                      boxShadow: "0 2px 12px #2196f322",
                    }}
                  />
                  <div className="producto-info" style={{ minHeight: 120 }}>
                    <div
                      className="producto-nombre"
                      style={{
                        fontWeight: 700,
                        fontSize: 19,
                        color: "#1976d2",
                      }}
                    >
                      {prod.nombre}
                    </div>
                    <div
                      className="producto-desc"
                      style={{
                        color: "#1565c0",
                        fontSize: 15,
                        margin: "6px 0 10px 0",
                      }}
                    >
                      {prod.descripcion}
                    </div>
                    <div
                      className="producto-precio"
                      style={{
                        fontWeight: 800,
                        fontSize: 18,
                        color: "#0d47a1",
                      }}
                    >
                      ${prod.precio.toFixed(2)}
                    </div>
                    <div
                      style={{
                        margin: "6px 0 10px 0",
                        color: "#ffd600",
                        fontSize: 16,
                      }}
                    >
                      {renderStars(prod.calificacion)}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      {prod.envioGratis && (
                        <span
                          style={{
                            background: "#e8f5e9",
                            color: "#43a047",
                            borderRadius: "1rem",
                            padding: "0.2rem 0.8rem",
                            fontWeight: 600,
                            fontSize: 13,
                            marginRight: 6,
                          }}
                        >
                          🚚 Envío gratis
                        </span>
                      )}
                      <span
                        style={{
                          color: prod.stock > 0 ? "#43a047" : "#e53935",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {prod.stock > 0
                          ? `${prod.stock} disponibles`
                          : "Sin stock"}
                      </span>
                    </div>
                    <button
                      className="producto-btn"
                      style={{
                        width: "100%",
                        marginTop: 6,
                        background:
                          prod.stock > 0
                            ? "linear-gradient(90deg, #2196f3 60%, #0d47a1 100%)"
                            : "#bdbdbd",
                        cursor: prod.stock > 0 ? "pointer" : "not-allowed",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        agregarAlCarrito(prod);
                      }}
                      disabled={prod.stock === 0}
                    >
                      {prod.stock === 0 ? "Sin stock" : "Añadir al carrito"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Principal2;