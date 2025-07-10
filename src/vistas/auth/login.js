import React, { useState } from 'react';
import './login.css'; // Asegúrate de tener el CSS adecuado
import { auth, db, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Consulta el documento del usuario en Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Si el usuario no existe, lo creamos automáticamente
        const uid = user.uid;
        const enlaces = generarEnlace(uid);
        
        const userData = {
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          referencia: 1,
          referidoPor,
          lado,
          enlaces
        };
        
        await setDoc(doc(db, "users", user.uid), userData);
        onLogin({ ...userData, uid: user.uid });
        
        // Limpiar localStorage después del login exitoso con Google
        localStorage.removeItem("uid");
        localStorage.removeItem("lado");
      } else {
        const data = userDoc.data();
        
        // Verifica el campo referencia
        if (data.referencia === 1) {
          onLogin({ ...data, uid: user.uid });
          
          // Limpiar localStorage después del login exitoso con Google
          localStorage.removeItem("uid");
          localStorage.removeItem("lado");
        } else {
          setError("No tienes permisos para acceder a esta sección.");
        }
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="form advanced-form">
      <h2>Iniciar sesión</h2>
      <div className="form-content">
        <div className="form-left">
          <form onSubmit={handleSubmit}>
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
              {loading ? "Ingresando..." : "Entrar"}
            </button>
            
            <div className="divider">
              <span>o</span>
            </div>
            
            <button 
              type="button" 
              className={`advanced-btn google-btn ${loading ? 'loading' : ''}`} 
              onClick={handleGoogleSignIn} 
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{marginRight: '8px'}}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Conectando..." : "Continuar con Google"}
            </button>
            
            <button type="button" className="advanced-btn secondary" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
          </form>
        </div>
        
        <div className="form-right">
          <h3>¡Bienvenido de vuelta!</h3>
          <p>Accede a tu cuenta y continúa construyendo tu red de éxito</p>
          <ul className="form-benefits">
            <li>Panel de control personalizado</li>
            <li>Seguimiento de tu red en tiempo real</li>
            <li>Herramientas de crecimiento avanzadas</li>
            <li>Soporte 24/7 disponible</li>
            <li>Acceso a recursos exclusivos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;