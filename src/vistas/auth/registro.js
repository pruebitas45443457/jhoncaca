import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function generarEnlace(uid) {
  const base = uid.toLowerCase();
   const host = window.location.origin; // toma http://localhost:3000 o https://miapp.com
    return [
      //geneologia Derecha
      `${host}/invitadoR/${base}`,

      //geneologia Izquierda
      `${host}/invitadoL/${base}`,

      //link de tienda-> shop
      `${host}/L_Shop/${base}`
    ];
    /*
   Puedes hacerlos más únicos agregando Math.random() o Date.now(), no se cunatos links quieres generar, ni si nececitas los mismos
   metodos por alguna razon, pero si quieres generar varios enlaces únicos, puedes hacer algo así:
  return [
    `https://miapp.com/invitado/${base}-${Math.random().toString(36).substring(2, 8)`,
    `https://miapp.com/invitado/{base}`,
    `https://miapp.com/invitado/${base}`
  ];*/
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
    const referencia= 1; // Asignar referencia por defecto
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      // Generar enlaces únicos
      const uid = userCredential.user.uid;
      const enlaces = generarEnlace(uid);
      


      // Guardar en Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        enlaces,
        referencia
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