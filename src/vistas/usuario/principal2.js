import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./principal2.css";
import Carrito from "./carro/carrito";

// Productos variados del mercado actual
const productos = [
  // Ropa
  {
    id: 1,
    nombre: "Camiseta Premium",
    descripcion: "Camiseta de algodón 100% orgánico, cómoda y duradera.",
    precio: 25.99,
    imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    categoria: "ropa",
    calificacion: 4.5,
    stock: 15,
    envioGratis: true,
  },
  {
    id: 2,
    nombre: "Jeans Clásicos",
    descripcion: "Jeans de corte clásico, perfectos para cualquier ocasión.",
    precio: 45.99,
    imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    categoria: "ropa",
    calificacion: 4.7,
    stock: 8,
    envioGratis: true,
  },
  {
    id: 3,
    nombre: "Zapatillas Deportivas",
    descripcion: "Zapatillas cómodas para running y actividades deportivas.",
    precio: 89.99,
    imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    categoria: "ropa",
    calificacion: 4.8,
    stock: 12,
    envioGratis: true,
  },
  
  // Comida
  {
    id: 4,
    nombre: "Café Premium",
    descripcion: "Café de origen único, tostado artesanalmente.",
    precio: 18.99,
    imagen: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80",
    categoria: "comida",
    calificacion: 4.9,
    stock: 25,
    envioGratis: false,
  },
  {
    id: 5,
    nombre: "Miel Orgánica",
    descripcion: "Miel pura de abeja, 100% natural y orgánica.",
    precio: 12.99,
    imagen: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    categoria: "comida",
    calificacion: 4.6,
    stock: 18,
    envioGratis: false,
  },
  {
    id: 6,
    nombre: "Aceite de Oliva Extra",
    descripcion: "Aceite de oliva virgen extra, primera prensada en frío.",
    precio: 22.99,
    imagen: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    categoria: "comida",
    calificacion: 4.7,
    stock: 10,
    envioGratis: true,
  },

  // Belleza
  {
    id: 7,
    nombre: "Crema Facial Hidratante",
    descripcion: "Crema facial con ácido hialurónico y vitamina E.",
    precio: 35.99,
    imagen: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    categoria: "belleza",
    calificacion: 4.4,
    stock: 20,
    envioGratis: true,
  },
  {
    id: 8,
    nombre: "Sérum Anti-edad",
    descripcion: "Sérum con retinol y colágeno para piel joven.",
    precio: 49.99,
    imagen: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=600&q=80",
    categoria: "belleza",
    calificacion: 4.8,
    stock: 7,
    envioGratis: true,
  },
  {
    id: 9,
    nombre: "Mascarilla Facial",
    descripcion: "Mascarilla purificante con carbón activado.",
    precio: 15.99,
    imagen: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=600&q=80",
    categoria: "belleza",
    calificacion: 4.3,
    stock: 30,
    envioGratis: false,
  },

  // Remedios/Salud
  {
    id: 10,
    nombre: "Vitamina C 1000mg",
    descripcion: "Suplemento de vitamina C para fortalecer el sistema inmune.",
    precio: 16.99,
    imagen: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    categoria: "salud",
    calificacion: 4.6,
    stock: 40,
    envioGratis: false,
  },
  {
    id: 11,
    nombre: "Omega 3",
    descripcion: "Cápsulas de omega 3 para la salud cardiovascular.",
    precio: 24.99,
    imagen: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80",
    categoria: "salud",
    calificacion: 4.7,
    stock: 22,
    envioGratis: true,
  },
  {
    id: 12,
    nombre: "Probióticos",
    descripcion: "Suplemento probiótico para la salud digestiva.",
    precio: 32.99,
    imagen: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80",
    categoria: "salud",
    calificacion: 4.5,
    stock: 15,
    envioGratis: true,
  },

  // Tecnología
  {
    id: 13,
    nombre: "Auriculares Bluetooth",
    descripcion: "Auriculares inalámbricos con cancelación de ruido.",
    precio: 79.99,
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    categoria: "tecnologia",
    calificacion: 4.6,
    stock: 12,
    envioGratis: true,
  },
  {
    id: 14,
    nombre: "Cargador Inalámbrico",
    descripcion: "Base de carga inalámbrica rápida para smartphones.",
    precio: 29.99,
    imagen: "https://images.unsplash.com/photo-1609592806955-d3b6c3b5e4b5?auto=format&fit=crop&w=600&q=80",
    categoria: "tecnologia",
    calificacion: 4.4,
    stock: 18,
    envioGratis: false,
  },
  {
    id: 15,
    nombre: "Smartwatch",
    descripcion: "Reloj inteligente con monitor de salud y GPS.",
    precio: 199.99,
    imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    categoria: "tecnologia",
    calificacion: 4.8,
    stock: 5,
    envioGratis: true,
  },
];

const categorias = [
  { id: "todas", nombre: "Todas", icono: "🛍️" },
  { id: "ropa", nombre: "Ropa", icono: "👕" },
  { id: "comida", nombre: "Comida", icono: "🍯" },
  { id: "belleza", nombre: "Belleza", icono: "💄" },
  { id: "salud", nombre: "Salud", icono: "💊" },
  { id: "tecnologia", nombre: "Tecnología", icono: "📱" },
];

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= Math.round(rating) ? "#ffd600" : "#e0e0e0",
          fontSize: 16,
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
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [ordenes, setOrdenes] = useState(() => {
    const ordenesGuardadas = localStorage.getItem("ordenes");
    return ordenesGuardadas ? JSON.parse(ordenesGuardadas) : [];
  });
  
  const navigate = useNavigate();

  // Guardar carrito y órdenes en localStorage
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem("ordenes", JSON.stringify(ordenes));
  }, [ordenes]);

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === "todas" || p.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

  function agregarAlCarrito(producto) {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: (p.cantidad || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function quitarDelCarrito(id) {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  function cambiarCantidad(id, cantidad) {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
  }

  function totalCarrito() {
    return carrito.reduce(
      (acc, prod) => acc + prod.precio * (prod.cantidad || 1),
      0
    ).toFixed(2);
  }

  function procesarCompra(datosCompra) {
    const nuevaOrden = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      productos: [...carrito],
      total: totalCarrito(),
      estado: "Procesando",
      datosEnvio: datosCompra
    };
    
    setOrdenes(prev => [nuevaOrden, ...prev]);
    setCarrito([]);
    setMostrarCarrito(false);
    
    // Mostrar confirmación
    alert("¡Compra realizada con éxito! Puedes ver tu orden en el historial.");
  }

  return (
    <div className="principal2-container">
      {/* Header con botón de regreso */}
      <header className="principal2-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/')}
        >
          ← Volver al Dashboard
        </button>
        
        <div className="header-actions">
          <button 
            className="header-btn"
            onClick={() => setMostrarPerfil(!mostrarPerfil)}
          >
            👤 Perfil
          </button>
          <button 
            className="header-btn carrito-btn"
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
          >
            🛒 Carrito ({carrito.length})
          </button>
        </div>
      </header>

      <div className="principal2-content">
        {/* Sidebar de categorías */}
        <aside className="categories-sidebar">
          <h3>Categorías</h3>
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${categoriaActiva === cat.id ? 'active' : ''}`}
              onClick={() => setCategoriaActiva(cat.id)}
            >
              <span className="category-icon">{cat.icono}</span>
              {cat.nombre}
            </button>
          ))}
        </aside>

        {/* Contenido principal */}
        <main className="main-content">
          {/* Barra de búsqueda */}
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Vista del carrito */}
          {mostrarCarrito && (
            <Carrito
              carrito={carrito}
              setCarrito={setCarrito}
              onVaciar={vaciarCarrito}
              onEliminar={quitarDelCarrito}
              onCambiarCantidad={cambiarCantidad}
              onCerrar={() => setMostrarCarrito(false)}
              onProcesarCompra={procesarCompra}
              ordenes={ordenes}
            />
          )}

          {/* Vista del perfil */}
          {mostrarPerfil && (
            <div className="perfil-section">
              <h2>Mi Perfil</h2>
              <div className="perfil-info">
                <div className="perfil-item">
                  <span className="perfil-label">👤 Usuario:</span>
                  <span>usuario_demo</span>
                </div>
                <div className="perfil-item">
                  <span className="perfil-label">✉️ Email:</span>
                  <span>usuario@demo.com</span>
                </div>
                <div className="perfil-item">
                  <span className="perfil-label">📦 Órdenes totales:</span>
                  <span>{ordenes.length}</span>
                </div>
              </div>
              
              {/* Historial de órdenes */}
              <div className="ordenes-historial">
                <h3>Historial de Órdenes</h3>
                {ordenes.length === 0 ? (
                  <p>No tienes órdenes aún.</p>
                ) : (
                  <div className="ordenes-lista">
                    {ordenes.map(orden => (
                      <div key={orden.id} className="orden-card">
                        <div className="orden-header">
                          <span className="orden-id">Orden #{orden.id}</span>
                          <span className="orden-fecha">{orden.fecha}</span>
                        </div>
                        <div className="orden-productos">
                          {orden.productos.map(prod => (
                            <div key={prod.id} className="orden-producto">
                              {prod.nombre} x{prod.cantidad}
                            </div>
                          ))}
                        </div>
                        <div className="orden-footer">
                          <span className="orden-total">Total: ${orden.total}</span>
                          <span className={`orden-estado ${orden.estado.toLowerCase()}`}>
                            {orden.estado}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vista de productos */}
          {!mostrarCarrito && !mostrarPerfil && (
            <>
              <div className="productos-header">
                <h2>
                  {categoriaActiva === "todas" 
                    ? "Todos los Productos" 
                    : categorias.find(c => c.id === categoriaActiva)?.nombre
                  }
                </h2>
                <span className="productos-count">
                  {productosFiltrados.length} productos encontrados
                </span>
              </div>

              <div className="productos-grid">
                {productosFiltrados.length === 0 ? (
                  <div className="no-productos">
                    <p>No se encontraron productos.</p>
                  </div>
                ) : (
                  productosFiltrados.map((producto) => (
                    <div key={producto.id} className="producto-card">
                      <div 
                        className="producto-imagen"
                        style={{ backgroundImage: `url(${producto.imagen})` }}
                      />
                      
                      <div className="producto-info">
                        <h3 className="producto-nombre">{producto.nombre}</h3>
                        <p className="producto-descripcion">{producto.descripcion}</p>
                        
                        <div className="producto-rating">
                          {renderStars(producto.calificacion)}
                          <span className="rating-text">({producto.calificacion})</span>
                        </div>
                        
                        <div className="producto-precio">
                          ${producto.precio.toFixed(2)}
                        </div>
                        
                        <div className="producto-badges">
                          {producto.envioGratis && (
                            <span className="badge envio-gratis">🚚 Envío gratis</span>
                          )}
                          <span className={`badge stock ${producto.stock > 0 ? 'disponible' : 'agotado'}`}>
                            {producto.stock > 0 ? `${producto.stock} disponibles` : "Sin stock"}
                          </span>
                        </div>
                        
                        <button
                          className={`producto-btn ${producto.stock === 0 ? 'disabled' : ''}`}
                          onClick={() => agregarAlCarrito(producto)}
                          disabled={producto.stock === 0}
                        >
                          {producto.stock === 0 ? "Sin stock" : "Añadir al carrito"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Principal2;