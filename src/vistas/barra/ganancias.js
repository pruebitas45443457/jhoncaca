import React, { useState } from 'react';
import './ganancias.css';

function Ganancias() {
  const [opcion, setOpcion] = useState(null);

  // Simulación de historial de ganancias
  const historial = [
    { fecha: '2024-06-01', tipo: 'Comisión', monto: 120 },
    { fecha: '2024-06-10', tipo: 'Bono de lealtad', monto: 50 },
    { fecha: '2024-06-15', tipo: 'Comisión', monto: 80 },
    { fecha: '2024-06-20', tipo: 'Retiro', monto: -100 },
  ];

  return (
    <div className="ganancias-panel">
      <h2>Historial de Ganancias</h2>
      <div className="ganancias-historial">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item, idx) => (
              <tr key={idx}>
                <td>{item.fecha}</td>
                <td>{item.tipo}</td>
                <td style={{color: item.monto < 0 ? "#ff5252" : "#21a1f3"}}>
                  {item.monto < 0 ? '-' : '+'}${Math.abs(item.monto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ganancias-opciones">
        <button
          className="ganancia-btn"
          onClick={() => setOpcion('bono')}
        >
          🎁 Bono de lealtad
        </button>
        <button
          className="ganancia-btn"
          onClick={() => setOpcion('retiro')}
        >
          💸 Retiro
        </button>
      </div>
      {opcion === 'bono' && (
        <div className="ganancia-detalle">
          <h3>Bono de lealtad</h3>
          <p>Aquí verás tus bonos de lealtad acumulados y su historial.</p>
          <button className="ganancia-btn" onClick={() => setOpcion(null)}>Cerrar</button>
        </div>
      )}
      {opcion === 'retiro' && (
        <div className="ganancia-detalle">
          <h3>Retiro</h3>
          <p>Solicita tu retiro o revisa el estado de tus retiros aquí.</p>
          <button className="ganancia-btn" onClick={() => setOpcion(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default Ganancias;