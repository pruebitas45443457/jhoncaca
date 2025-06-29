import React, { useState } from "react";
// Suponiendo que tienes acceso a la función para obtener usuario y actualizarlo
// Por ejemplo, usando Firebase Firestore:
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Carrito({ carrito, setCarrito, onVaciar, onEliminar, onCambiarCantidad, onCerrar }) {
  const [mostrandoDireccion, setMostrandoDireccion] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [guardando, setGuardando] = useState(false);

  const total = carrito.reduce(
    (acc, prod) => acc + (prod.precio || 0) * (prod.cantidad || 1),
    0
  );

  const envio = total > 0 ? 3.99 : 0;
  const totalFinal = total + envio;

  // Verifica si el usuario tiene dirección antes de proceder al pago
  const handleFinalizarCompra = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists() || !userSnap.data().direccion) {
      setMostrandoDireccion(true);
      return;
    }
    alert("¡Compra realizada! (simulado)");
  };

  // Guardar dirección en la colección users
  const handleGuardarDireccion = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { direccion });
      setMostrandoDireccion(false);
      alert("Dirección guardada correctamente. Ahora puedes finalizar tu compra.");
    } catch (err) {
      alert("Error al guardar la dirección.");
    }
    setGuardando(false);
  };

  return (
    <div
      className="carrito-container"
      style={{
        maxWidth: 900,
        margin: "2.5rem auto",
        padding: "2.5rem 1.5rem",
        background: "linear-gradient(120deg, #e3f2fd 60%, #fff 100%)",
        borderRadius: "2rem",
        boxShadow: "0 8px 32px #2196f344",
        minHeight: 400,
        animation: "fadeIn 0.8s",
        position: "relative",
      }}
    >
      {/* Glow decorativo */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          background: "radial-gradient(circle, #2196f3 0%, transparent 70%)",
          opacity: 0.13,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <h2
        style={{
          color: "#1976d2",
          fontWeight: 900,
          marginBottom: 32,
          letterSpacing: 1,
          textAlign: "center",
          fontSize: "2.1rem",
          textShadow: "0 2px 12px #2196f344",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span role="img" aria-label="carrito">
          🛒
        </span>{" "}
        Mi Carrito
        <button
          onClick={onCerrar}
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: 28,
            color: "#888",
            cursor: "pointer",
            marginTop: -8,
            marginRight: -8,
            transition: "color 0.18s",
          }}
          title="Cerrar"
          onMouseOver={e => (e.currentTarget.style.color = "#1976d2")}
          onMouseOut={e => (e.currentTarget.style.color = "#888")}
        >
          ✖
        </button>
      </h2>
      {carrito.length === 0 ? (
        <div
          style={{
            color: "#888",
            fontSize: 20,
            textAlign: "center",
            marginTop: 60,
            letterSpacing: 1,
          }}
        >
          <span role="img" aria-label="empty">
            🛍️
          </span>{" "}
          Tu carrito está vacío.
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
          {/* Tabla de productos */}
          <div style={{ flex: 2, minWidth: 340 }}>
            <div
              style={{
                overflowX: "auto",
                borderRadius: "1.5rem",
                boxShadow: "0 2px 12px #2196f322",
                background: "rgba(255,255,255,0.97)",
                marginBottom: 32,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 500,
                }}
              >
                <thead>
                  <tr style={{ background: "#e3f2fd" }}>
                    <th style={{ padding: 12, borderRadius: "1rem 0 0 1rem" }}>Producto</th>
                    <th style={{ padding: 12 }}>Precio</th>
                    <th style={{ padding: 12 }}>Cantidad</th>
                    <th style={{ padding: 12 }}>Subtotal</th>
                    <th style={{ padding: 12, borderRadius: "0 1rem 1rem 0" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((prod, idx) => (
                    <tr
                      key={prod.nombre}
                      style={{
                        background: idx % 2 === 0 ? "#f5fafd" : "#fff",
                        borderBottom: "1px solid #e3f2fd",
                        transition: "background 0.18s",
                      }}
                    >
                      <td style={{ padding: 12, fontWeight: 700, color: "#1976d2", display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={prod.imagen || "https://via.placeholder.com/48x48?text=🛒"}
                          alt={prod.nombre}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            objectFit: "cover",
                            boxShadow: "0 2px 8px #2196f344",
                            marginRight: 8,
                            border: "1.5px solid #e3f2fd",
                            background: "#fff",
                          }}
                        />
                        <span>
                          {prod.nombre}
                          {prod.nuevo && (
                            <span
                              style={{
                                marginLeft: 8,
                                background: "linear-gradient(90deg, #ffd600 60%, #ff9800 100%)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 12,
                                padding: "2px 10px",
                                borderRadius: "1rem",
                                boxShadow: "0 2px 8px #ffd60044",
                                letterSpacing: 1,
                                marginTop: 2,
                              }}
                            >
                              Nuevo
                            </span>
                          )}
                        </span>
                      </td>
                      <td style={{ padding: 12, fontWeight: 600, color: "#0d47a1" }}>
                        ${prod.precio?.toFixed(2)}
                      </td>
                      <td style={{ padding: 12 }}>
                        <button
                          onClick={() => onCambiarCantidad(prod.nombre, (prod.cantidad || 1) - 1)}
                          disabled={prod.cantidad <= 1}
                          style={{
                            background: "#e3f2fd",
                            border: "none",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            fontWeight: 900,
                            color: "#1976d2",
                            fontSize: 18,
                            cursor: prod.cantidad > 1 ? "pointer" : "not-allowed",
                            marginRight: 6,
                            transition: "background 0.18s",
                          }}
                          title="Quitar uno"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={prod.cantidad || 1}
                          onChange={e => onCambiarCantidad(prod.nombre, parseInt(e.target.value) || 1)}
                          style={{
                            width: 48,
                            textAlign: "center",
                            borderRadius: 8,
                            border: "1.5px solid #e3f2fd",
                            fontWeight: 700,
                            fontSize: 16,
                            color: "#1976d2",
                            background: "#f5fafd",
                          }}
                        />
                        <button
                          onClick={() => onCambiarCantidad(prod.nombre, (prod.cantidad || 1) + 1)}
                          style={{
                            background: "#2196f3",
                            border: "none",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            fontWeight: 900,
                            color: "#fff",
                            fontSize: 18,
                            cursor: "pointer",
                            marginLeft: 6,
                            transition: "background 0.18s",
                          }}
                          title="Agregar uno"
                        >
                          +
                        </button>
                      </td>
                      <td style={{ padding: 12, fontWeight: 700, color: "#0d47a1" }}>
                        ${(prod.precio * (prod.cantidad || 1)).toFixed(2)}
                      </td>
                      <td style={{ padding: 12 }}>
                        <button
                          onClick={() => onEliminar(prod.nombre)}
                          style={{
                            background: "linear-gradient(90deg, #e57373 60%, #d32f2f 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "6px 18px",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: 15,
                            boxShadow: "0 2px 8px #e5737344",
                            transition: "background 0.18s, transform 0.18s",
                          }}
                          onMouseOver={e => (e.currentTarget.style.transform = "scale(1.08)")}
                          onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                          title="Eliminar producto"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={onVaciar}
              style={{
                background: "#bdbdbd",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 24px",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: 16,
                boxShadow: "0 2px 8px #bdbdbd44",
                transition: "background 0.18s, transform 0.18s",
                marginBottom: 24,
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#757575")}
              onMouseOut={e => (e.currentTarget.style.background = "#bdbdbd")}
            >
              Vaciar Carrito
            </button>
          </div>
          {/* Resumen de compra */}
          <div
            style={{
              flex: 1,
              minWidth: 260,
              background: "rgba(255,255,255,0.98)",
              borderRadius: "1.5rem",
              boxShadow: "0 2px 12px #2196f322",
              padding: "2rem 1.2rem 1.2rem 1.2rem",
              height: "fit-content",
              alignSelf: "flex-start",
              position: "sticky",
              top: 40,
              zIndex: 2,
            }}
          >
            <h3 style={{ color: "#1976d2", fontWeight: 900, marginBottom: 18, fontSize: 22 }}>
              Resumen de compra
            </h3>
            <div style={{ fontSize: 16, marginBottom: 10, color: "#555" }}>
              Productos: <span style={{ float: "right", fontWeight: 700, color: "#0d47a1" }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: 16, marginBottom: 10, color: "#555" }}>
              Envío: <span style={{ float: "right", fontWeight: 700, color: "#0d47a1" }}>{envio > 0 ? `$${envio.toFixed(2)}` : "Gratis"}</span>
            </div>
            <div style={{ borderTop: "1.5px solid #e3f2fd", margin: "14px 0" }} />
            <div style={{ fontSize: 20, fontWeight: 900, color: "#1976d2", marginBottom: 18 }}>
              Total a pagar: <span style={{ float: "right", color: "#0d47a1" }}>${totalFinal.toFixed(2)}</span>
            </div>
            <button
              style={{
                background: "linear-gradient(90deg, #2196f3 60%, #0d47a1 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px 0",
                width: "100%",
                fontWeight: 900,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 2px 8px #2196f344",
                letterSpacing: 1,
                transition: "background 0.18s, transform 0.18s",
                marginBottom: 10,
              }}
              onClick={handleFinalizarCompra}
              onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
              disabled={carrito.length === 0}
            >
              Finalizar Compra
            </button>
            <div style={{ fontSize: 13, color: "#888", textAlign: "center", marginTop: 8 }}>
              <span role="img" aria-label="lock">🔒</span> Pago seguro SSL
            </div>
          </div>
        </div>
      )}
      {mostrandoDireccion && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(33,150,243,0.13)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleGuardarDireccion}
            style={{
              background: "#fff",
              borderRadius: "1.5rem",
              boxShadow: "0 4px 32px #2196f344",
              padding: "2.5rem 2rem",
              minWidth: 320,
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setMostrandoDireccion(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 22,
                color: "#888",
                cursor: "pointer",
              }}
              title="Cerrar"
            >
              ✖
            </button>
            <h3 style={{ color: "#1976d2", fontWeight: 900, marginBottom: 8 }}>
              Ingresa tu dirección de envío
            </h3>
            <input
              type="text"
              required
              placeholder="Calle, número, ciudad, provincia..."
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              style={{
                borderRadius: 10,
                border: "1.5px solid #e3f2fd",
                padding: "0.7rem 1rem",
                fontSize: 16,
                color: "#1976d2",
                background: "#f5fafd",
                fontWeight: 600,
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={guardando || !direccion}
              style={{
                background: "linear-gradient(90deg, #2196f3 60%, #0d47a1 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                width: "100%",
                fontWeight: 900,
                fontSize: 17,
                cursor: guardando ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px #2196f344",
                letterSpacing: 1,
                marginTop: 8,
                opacity: guardando ? 0.7 : 1,
              }}
            >
              {guardando ? "Guardando..." : "Guardar dirección"}
            </button>
          </form>
        </div>
      )}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
}

export default Carrito;