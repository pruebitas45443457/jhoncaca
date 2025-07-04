import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


function Login({ onLogin, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Inicia sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Consulta el documento del usuario en Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("Usuario no encontrado en la base de datos.");
        setLoading(false);
        return;
      }

      const data = userDoc.data();
      console.log("Referencia:", data.referencia, typeof data.referencia);

      // Verifica el campo referencia
      if (data.referencia === 1) {
        onLogin({ ...data, uid: user.uid }); // Permite el acceso
      } else {
        setError("No tienes permisos para acceder a esta sección.");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form className="form advanced-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div style={{ color: "#ff5252", marginBottom: 10 }}>{error}</div>}
      <button type="submit" className="advanced-btn" disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </button>
      <button type="button" className="advanced-btn secondary" onClick={onCancel} disabled={loading}>
        Cancelar
      </button>
    </form>
  );
}

export default Login;