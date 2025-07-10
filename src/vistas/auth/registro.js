import React, { useState } from 'react';
import './login.css';
import { auth, db, googleProvider } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

function generarEnlace(uid) {
  const base = uid;
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
const referidoPor = localStorage.getItem("uid") || null;

const Viewlado = () => {
  const Bool = localStorage.getItem("lado"); // obtiene un string o null
  let lado = "";

  if (Bool === "false") {
    lado = "izquierda";
  } else if (Bool === "true") {
    lado = "derecha";
  } else {
    lado = null;
  }

  return lado || null;
};

const lado = Viewlado(); // Llama a la función para obtener el lado del usuario


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
        referencia,
        referidoPor,
        lado, // Guardar el lado del usuario
      });

      onRegister({ username, email });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    const referencia = 1; // Asignar referencia por defecto
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Verificar si el usuario ya existe
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Si el usuario no existe, lo creamos
        const uid = user.uid;
        const enlaces = generarEnlace(uid);
        
        const userData = {
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          enlaces,
          referencia,
          referidoPor,
          lado, // Guardar el lado del usuario
        };

        await setDoc(doc(db, "users", user.uid), userData);
        onRegister({ username: userData.username, email: userData.email });
      } else {
        // Si el usuario ya existe, simplemente lo registramos
        const data = userDoc.data();
        onRegister({ username: data.username, email: data.email });
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  localStorage.removeItem("uid");
  localStorage.removeItem("lado");
  return (
    <div className="form advanced-form">
      <h2>Registro</h2>
      <div className="form-content">
        <div className="form-left">
          <form onSubmit={handleSubmit}>
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
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className={`advanced-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
            
            <div className="divider">
              <span>o</span>
            </div>
            
            <button 
              type="button" 
              className={`advanced-btn google-btn ${loading ? 'loading' : ''}`} 
              onClick={handleGoogleSignUp} 
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{marginRight: '8px'}}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Conectando..." : "Registrarse con Google"}
            </button>
            
            <button type="button" className="advanced-btn secondary" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
          </form>
        </div>
        
        <div className="form-right">
          <h3>¡Únete a AMJ!</h3>
          <p>Crea tu cuenta y comienza a construir tu red de éxito desde hoy</p>
          <ul className="form-benefits">
            <li>Registro completamente gratuito</li>
            <li>Enlaces de invitación únicos</li>
            <li>Panel de control intuitivo</li>
            <li>Comisiones por referidos</li>
            <li>Comunidad de emprendedores</li>
            <li>Herramientas de crecimiento</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Registro;