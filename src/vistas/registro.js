import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function generarEnlace(username) {
  // Puedes hacerlos más únicos agregando Math.random() o Date.now()
  const base = username.toLowerCase();
  return [
    `https://miapp.com/invite/${base}-${Math.random().toString(36).substring(2, 8)}`,
    `https://miapp.com/invite/${base}-${Math.random().toString(36).substring(2, 8)}`,
    `https://miapp.com/invite/${base}-${Math.random().toString(36).substring(2, 8)}`
  ];
}

function Registro({ onRegister, onCancel }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      // Generar enlaces únicos
      const enlaces = generarEnlace(username);

      // Guardar en Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        enlaces
      });

      onRegister({ username, email });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form className="form advanced-form" onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
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
        {loading ? "Registrando..." : "Registrarse"}
      </button>
      <button type="button" className="advanced-btn secondary" onClick={onCancel} disabled={loading}>
        Cancelar
      </button>
    </form>
  );
}

export default Registro;