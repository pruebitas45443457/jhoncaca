import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';


function InvitadoR(){

    const { id } = useParams();
    const lado = true; // Asumiendo que este es el lado derecho
  useEffect(() => {
    if (id) {
      localStorage.setItem('uid', id);
      localStorage.setItem('lado', lado); // Guardamos el lado derecho
    }
  }, [id]);
    return (
      <>
       
        <div className="invitado">
            <h1>Invitado</h1>
            <p>El id de la persona que te invito es: {id}</p>
            <p>este es el link derecho</p>
            <p>Bienvenido, invitado. Por favor, inicia sesión para continuar.</p>
        </div>
      
      </>  
    );

};

export default InvitadoR;


