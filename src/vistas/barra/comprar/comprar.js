import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './comprar.css'; // Importa aquí el CSS avanzado

function Comprar() {
  const [datos, setDatos] = useState(null);
  const [form, setForm] = useState({
    direccion: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    referencia: '',
    comentario: ''
  });
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDatos(data);
        setForm({
          direccion: data.direccion || '',
          nombres: data.nombres || '',
          apellidos: data.apellidos || '',
          telefono: data.telefono || '',
          referencia: data.referencia || '',
          comentario: data.comentario || ''
        });
        // Si falta algún campo, forzar edición
        if (!data.direccion || !data.nombres || !data.apellidos || !data.telefono || !data.referencia) {
          setEditando(true);
        }
      } else {
        setEditando(true);
      }
    };
    fetchDatos();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async e => {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No autenticado");
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        direccion: form.direccion,
        nombres: form.nombres,
        apellidos: form.apellidos,
        telefono: form.telefono,
        referencia: form.referencia,
        comentario: form.comentario
      });
      setMensaje('¡Datos guardados correctamente!');
      setEditando(false);
      setDatos({ ...datos, ...form });
    } catch (err) {
      setMensaje('Error al guardar: ' + err.message);
    }
    setGuardando(false);
  };

  const productos = [
    {
      nombre: "Suplemento Premium",
      descripcion: "Mejora tu energía y bienestar con ingredientes naturales.",
      precio: 29.99,
      imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    },
    {
      nombre: "Proteína Vegana",
      descripcion: "Ideal para recuperación muscular y dietas saludables.",
      precio: 39.99,
      imagen: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80"
    },
    {
      nombre: "Vitaminas Complejas",
      descripcion: "Refuerza tu sistema inmune con vitaminas esenciales.",
      precio: 19.99,
      imagen: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
    },
    {
      nombre: "Bebida Detox",
      descripcion: "Limpia tu organismo y siente la diferencia.",
      precio: 24.99,
      imagen: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
    }
  ];

  if (editando) {
    return (
      <div className="comprar-form">
        <h2>Información de Envío</h2>
        <form onSubmit={handleGuardar}>
          <label>Dirección completa*</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} required />
          <label>Nombres*</label>
          <input name="nombres" value={form.nombres} onChange={handleChange} required />
          <label>Apellidos*</label>
          <input name="apellidos" value={form.apellidos} onChange={handleChange} required />
          <label>Teléfono*</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} required />
          <label>Referencia*</label>
          <input name="referencia" value={form.referencia} onChange={handleChange} required />
          <label>Comentario</label>
          <textarea name="comentario" value={form.comentario} onChange={handleChange} />
          <button type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</button>
        </form>
        {mensaje && <div style={{marginTop:10, color: mensaje.startsWith('¡') ? 'green' : 'red'}}>{mensaje}</div>}
      </div>
    );
  }

  return (
    <>
      <div className="comprar-info-flex">
        <div className="comprar-info-izq">
          <h2>Información de Envío</h2>
          <div><span className="comprar-label">Dirección:</span> <span className="comprar-dato">{datos?.direccion}</span></div>
          <div><span className="comprar-label">Nombres:</span> <span className="comprar-dato">{datos?.nombres}</span></div>
          <div><span className="comprar-label">Apellidos:</span> <span className="comprar-dato">{datos?.apellidos}</span></div>
          <div><span className="comprar-label">Teléfono:</span> <span className="comprar-dato">{datos?.telefono}</span></div>
          <div><span className="comprar-label">Referencia:</span> <span className="comprar-dato">{datos?.referencia}</span></div>
          <button style={{marginTop:20}} onClick={() => setEditando(true)}>Editar información</button>
          {mensaje && <div style={{marginTop:10, color: mensaje.startsWith('¡') ? 'green' : 'red'}}>{mensaje}</div>}
        </div>
        <div className="comprar-info-der">
          <h3>Comentario</h3>
          <div className="comprar-comentario">{datos?.comentario || '-'}</div>
        </div>
      </div>

      {/* Sección de productos */}
      <div className="productos-titulo">
        <h2>Productos Destacados</h2>
      </div>
      <div className="productos-grid">
        {productos.map((prod, i) => (
          <div className="producto-card" key={i}>
            <div className="producto-img" style={{backgroundImage: `url(${prod.imagen})`}} />
            <div className="producto-info">
              <div className="producto-nombre">{prod.nombre}</div>
              <div className="producto-desc">{prod.descripcion}</div>
              <div className="producto-precio">${prod.precio.toFixed(2)}</div>
              <button className="producto-btn">Comprar</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Comprar;