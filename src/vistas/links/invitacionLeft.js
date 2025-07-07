import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function InvitadoL(){

    const { id } = useParams();
    const lado = false;
  useEffect(() => {
    if (id) {
      localStorage.setItem('uid', id);
      localStorage.setItem('lado', lado);
    }
  }, [id]);
    return (
        <div className="invitado">
            <h1>Invitado</h1>
            <p>El id de la persona que te invito es: {id}</p>
            <p>este es el link izquierdo</p>
            <p>Bienvenido, invitado. Por favor, inicia sesión para continuar.</p>
        </div>
    );

};

export default InvitadoL;


