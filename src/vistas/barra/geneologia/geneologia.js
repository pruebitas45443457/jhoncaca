import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './geneologia.css';

function Genealogia() {
  const [usuario, setUsuario] = useState(null);
  const [izquierda, setIzquierda] = useState([]);
  const [derecha, setDerecha] = useState([]);

  useEffect(() => {
    const fetchGenealogia = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Obtén datos del usuario actual
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      setUsuario({ username: data.username, email: data.email });

      // Busca invitados por campo "referidoPor" y "lado"
      const invitadosRef = collection(db, "users");
      const q = query(invitadosRef, where("referidoPor", "==", user.uid));
      const querySnap = await getDocs(q);

      const izq = [];
      const der = [];
      querySnap.forEach(docu => {
        const d = docu.data();
        if (d.lado === "izquierda") izq.push(d);
        else if (d.lado === "derecha") der.push(d);
      });
      setIzquierda(izq);
      setDerecha(der);
    };
    fetchGenealogia();
  }, []);

  return (
    <div className="gene-arbol">
      <div className="gene-nivel gene-nivel-yo">
        <div className="gene-nodo gene-nodo-yo">
          <div className="gene-avatar">{usuario?.username?.[0]?.toUpperCase() || "👤"}</div>
          <div className="gene-nombre">{usuario?.username || "Tú"}</div>
          <div className="gene-email">{usuario?.email}</div>
        </div>
      </div>
      <div className="gene-nivel gene-nivel-invitados">
        <div className="gene-nodo gene-nodo-izq">
          <div className="gene-label">Izquierda</div>
          {izquierda.length === 0 ? (
            <div className="gene-vacio">Vacío</div>
          ) : izquierda.map((u, i) => (
            <div key={i} className="gene-invitado">
              <div className="gene-avatar">{u.username?.[0]?.toUpperCase() || "👤"}</div>
              <div className="gene-nombre">{u.username}</div>
              <div className="gene-email">{u.email}</div>
            </div>
          ))}
        </div>
        <div className="gene-nodo gene-nodo-der">
          <div className="gene-label">Derecha</div>
          {derecha.length === 0 ? (
            <div className="gene-vacio">Vacío</div>
          ) : derecha.map((u, i) => (
            <div key={i} className="gene-invitado">
              <div className="gene-avatar">{u.username?.[0]?.toUpperCase() || "👤"}</div>
              <div className="gene-nombre">{u.username}</div>
              <div className="gene-email">{u.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Genealogia;