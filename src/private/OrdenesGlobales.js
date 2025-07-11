import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useEffect, useState } from "react";

function OrdenesGlobales({ user }) {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchCompras = async () => {
      const querySnapshot = await getDocs(collection(db, "compras"));
      const ordenes = [];
      querySnapshot.forEach(docSnap => {
        ordenes.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCompras(ordenes);
    };
    fetchCompras();
  }, []);

  const marcarCompletada = async (ordenId) => {
    const confirmar = window.confirm("¿Deseas marcar esta orden como completada?");
    if (!confirmar) return;

    try {
      const ordenRef = doc(db, "compras", ordenId);
      await updateDoc(ordenRef, { completado: true });

      // Actualiza localmente también
      setCompras(prev =>
        prev.map(orden =>
          orden.id === ordenId ? { ...orden, completado: true } : orden
        )
      );
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <div>
      <h1>Órdenes Globales</h1>
      <p>UID: {user.uid}</p>
      <p>Nombre: {user.username || 'No definido'}</p>
      <p>Email: {user.email || 'No definido'}</p>

      <table className="ordenes-tabla">
        <thead>
          <tr>
            <th>ID Compra</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Referido Por</th>
            <th>✔</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((orden) => (
            <tr key={orden.id}>
              <td>{orden.id}</td>
              <td>{(orden.datosEnvio?.nombres || '') + ' ' + (orden.datosEnvio?.apellidos || '')}</td>
              <td>{orden.datosEnvio?.direccion || ''}</td>
              <td>{orden.datosEnvio?.telefono || ''}</td>
              <td>{orden.fecha ? new Date(orden.fecha.seconds * 1000).toLocaleDateString() : ''}</td>
              <td>{orden.producto?.nombre || ''}</td>
              <td>{orden.producto?.precio ? `$${orden.producto.precio}` : ''}</td>
              <td>{orden.datosEnvio?.referencia || ''}</td>
              <td>
                <input
                  type="checkbox"
                  checked={orden.completado || false}
                  disabled={orden.completado}
                  onChange={() => marcarCompletada(orden.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdenesGlobales;
