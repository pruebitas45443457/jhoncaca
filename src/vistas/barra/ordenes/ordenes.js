import React from "react";

const ordenesEjemplo = [
  {
    id: "ORD-001",
    fecha: "2025-06-29",
    estado: "Enviado",
    total: 59.99,
    productos: [
      { nombre: "Suplemento Premium", cantidad: 1 },
      { nombre: "Proteína Vegana", cantidad: 2 },
    ],
  },
  {
    id: "ORD-002",
    fecha: "2025-06-15",
    estado: "Entregado",
    total: 24.99,
    productos: [
      { nombre: "Bebida Detox", cantidad: 1 },
    ],
  },
];

function getEstadoColor(estado) {
  if (estado === "Entregado") return { bg: "#e8f5e9", color: "#43a047" };
  if (estado === "Enviado") return { bg: "#e3f2fd", color: "#1976d2" };
  if (estado === "Pendiente") return { bg: "#fffde7", color: "#fbc02d" };
  return { bg: "#ececec", color: "#888" };
}

function Ordenes() {
  return (
    <div
      className="ordenes-container"
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "2.5rem 1rem",
        background: "linear-gradient(120deg, #e3f2fd 60%, #fff 100%)",
        borderRadius: "2rem",
        boxShadow: "0 8px 32px #2196f344",
        minHeight: 400,
        animation: "fadeIn 0.8s",
      }}
    >
      <h2
        style={{
          color: "#1976d2",
          fontWeight: 900,
          marginBottom: 32,
          letterSpacing: 1,
          textAlign: "center",
          fontSize: "2.1rem",
          textShadow: "0 2px 12px #2196f344",
        }}
      >
        <span role="img" aria-label="ordenes">
          📦
        </span>{" "}
        Mis Órdenes
      </h2>
      {ordenesEjemplo.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18, textAlign: "center" }}>
          No tienes órdenes registradas.
        </div>
      ) : (
        <div className="ordenes-lista" style={{ display: "grid", gap: 32 }}>
          {ordenesEjemplo.map((orden) => {
            const estadoColor = getEstadoColor(orden.estado);
            return (
              <div
                key={orden.id}
                className="orden-card"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: "1.5rem",
                  boxShadow: "0 4px 24px #2196f322",
                  padding: "2rem 1.5rem 1.5rem 1.5rem",
                  border: "2px solid #e3f2fd",
                  position: "relative",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  animation: "fadeInUp 0.7s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.025)";
                  e.currentTarget.style.boxShadow = "0 8px 32px #2196f344";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 24px #2196f322";
                }}
              >
                {/* Glow decorativo */}
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    background: "radial-gradient(circle, #2196f3 0%, transparent 70%)",
                    opacity: 0.12,
                    pointerEvents: "none",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: "#1565c0", fontSize: 18 }}>
                    <span style={{ opacity: 0.7 }}>#</span>
                    {orden.id}
                  </span>
                  <span
                    style={{
                      background: estadoColor.bg,
                      color: estadoColor.color,
                      borderRadius: "1rem",
                      padding: "4px 18px",
                      fontWeight: 800,
                      fontSize: 15,
                      boxShadow: "0 2px 8px #2196f322",
                      letterSpacing: 1,
                      border: `1.5px solid ${estadoColor.color}22`,
                      textTransform: "uppercase",
                    }}
                  >
                    {orden.estado}
                  </span>
                </div>
                <div style={{ color: "#888", fontSize: 15, marginBottom: 12 }}>
                  <span role="img" aria-label="fecha">📅</span> Fecha:{" "}
                  <span style={{ color: "#1976d2", fontWeight: 600 }}>{orden.fecha}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <b style={{ color: "#1976d2" }}>Productos:</b>
                  <ul style={{ margin: 0, paddingLeft: 22 }}>
                    {orden.productos.map((prod, idx) => (
                      <li key={idx} style={{ color: "#1976d2", fontWeight: 500, fontSize: 15 }}>
                        {prod.nombre}{" "}
                        <span style={{ color: "#888", fontWeight: 700 }}>x{prod.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ fontWeight: 900, color: "#0d47a1", fontSize: 19, textAlign: "right" }}>
                  Total: ${orden.total.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
}

export default Ordenes;