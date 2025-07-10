import React, { useState } from "react";
import "./carrito.css";

function Carrito({ 
  carrito, 
  setCarrito, 
  onVaciar, 
  onEliminar, 
  onCambiarCantidad, 
  onCerrar, 
  onProcesarCompra,
  ordenes 
}) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [datosCompra, setDatosCompra] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    metodoPago: "tarjeta"
  });
  const [procesando, setProcesando] = useState(false);

  const total = carrito.reduce(
    (acc, prod) => acc + (prod.precio || 0) * (prod.cantidad || 1),
    0
  );

  const envio = total > 50 ? 0 : 5.99;
  const totalFinal = total + envio;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosCompra(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitCompra = async (e) => {
    e.preventDefault();
    setProcesando(true);
    
    // Simular procesamiento
    setTimeout(() => {
      onProcesarCompra(datosCompra);
      setMostrarFormulario(false);
      setDatosCompra({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        metodoPago: "tarjeta"
      });
      setProcesando(false);
    }, 2000);
  };

  if (mostrarFormulario) {
    return (
      <div className="carrito-container">
        <div className="carrito-header">
          <h2>🛒 Finalizar Compra</h2>
          <button 
            className="close-btn"
            onClick={() => setMostrarFormulario(false)}
          >
            ← Volver al carrito
          </button>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <h3>Datos de envío</h3>
            <form onSubmit={handleSubmitCompra}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={datosCompra.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={datosCompra.email}
                    onChange={handleInputChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={datosCompra.telefono}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="form-group">
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={datosCompra.ciudad}
                    onChange={handleInputChange}
                    required
                    placeholder="Tu ciudad"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dirección completa *</label>
                <input
                  type="text"
                  name="direccion"
                  value={datosCompra.direccion}
                  onChange={handleInputChange}
                  required
                  placeholder="Calle, número, apartamento, etc."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Código postal *</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={datosCompra.codigoPostal}
                    onChange={handleInputChange}
                    required
                    placeholder="12345"
                  />
                </div>
                <div className="form-group">
                  <label>Método de pago *</label>
                  <select
                    name="metodoPago"
                    value={datosCompra.metodoPago}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="tarjeta">💳 Tarjeta de crédito</option>
                    <option value="paypal">🅿️ PayPal</option>
                    <option value="transferencia">🏦 Transferencia</option>
                    <option value="efectivo">💵 Efectivo contra entrega</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={procesando}
              >
                {procesando ? "Procesando..." : `Confirmar compra - $${totalFinal.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h3>Resumen del pedido</h3>
            <div className="summary-items">
              {carrito.map((prod) => (
                <div key={prod.id} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{prod.nombre}</span>
                    <span className="item-quantity">x{prod.cantidad}</span>
                  </div>
                  <span className="item-price">
                    ${(prod.precio * prod.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Envío:</span>
                <span>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
              </div>
              <div className="total-line final-total">
                <span>Total:</span>
                <span>${totalFinal.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-badges">
              <div className="badge">🔒 Pago seguro SSL</div>
              <div className="badge">📦 Envío garantizado</div>
              <div className="badge">↩️ Devolución fácil</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <h2>🛒 Mi Carrito ({carrito.length})</h2>
        <button className="close-btn" onClick={onCerrar}>
          ✖ Cerrar
        </button>
      </div>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <div className="empty-icon">🛍️</div>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos para comenzar</p>
        </div>
      ) : (
        <div className="carrito-content">
          <div className="carrito-items">
            {carrito.map((prod) => (
              <div key={prod.id} className="carrito-item">
                <div 
                  className="item-imagen"
                  style={{ backgroundImage: `url(${prod.imagen})` }}
                />
                
                <div className="item-info">
                  <h4 className="item-nombre">{prod.nombre}</h4>
                  <p className="item-descripcion">{prod.descripcion}</p>
                  <div className="item-precio">${prod.precio.toFixed(2)}</div>
                </div>

                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => onCambiarCantidad(prod.id, prod.cantidad - 1)}
                      disabled={prod.cantidad <= 1}
                    >
                      −
                    </button>
                    <span className="quantity">{prod.cantidad}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onCambiarCantidad(prod.id, prod.cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-subtotal">
                    ${(prod.precio * prod.cantidad).toFixed(2)}
                  </div>
                  
                  <button
                    className="remove-btn"
                    onClick={() => onEliminar(prod.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-summary">
            <div className="summary-section">
              <h3>Resumen de compra</h3>
              
              <div className="summary-line">
                <span>Subtotal ({carrito.length} productos):</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="summary-line">
                <span>Envío:</span>
                <span>
                  {envio === 0 ? (
                    <span className="free-shipping">Gratis 🎉</span>
                  ) : (
                    `$${envio.toFixed(2)}`
                  )}
                </span>
              </div>
              
              {total < 50 && total > 0 && (
                <div className="shipping-notice">
                  Agrega ${(50 - total).toFixed(2)} más para envío gratis
                </div>
              )}
              
              <div className="summary-line total-line">
                <span>Total:</span>
                <span>${totalFinal.toFixed(2)}</span>
              </div>

              <div className="action-buttons">
                <button
                  className="checkout-btn"
                  onClick={() => setMostrarFormulario(true)}
                >
                  Proceder al pago
                </button>
                
                <button
                  className="clear-btn"
                  onClick={onVaciar}
                >
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* Historial de órdenes en el carrito */}
            {ordenes && ordenes.length > 0 && (
              <div className="ordenes-recientes">
                <h4>Órdenes recientes</h4>
                <div className="ordenes-lista-mini">
                  {ordenes.slice(0, 3).map(orden => (
                    <div key={orden.id} className="orden-mini">
                      <div className="orden-mini-info">
                        <span className="orden-mini-id">#{orden.id}</span>
                        <span className="orden-mini-fecha">{orden.fecha}</span>
                      </div>
                      <div className="orden-mini-total">${orden.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;