import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Invitado(){

    const { id } = useParams();

  useEffect(() => {
    if (id) {
      localStorage.setItem('uid', id);
    }
  }, [id]);
    return (
        <div className="invitado">
            <h1>Invitado</h1>
            <p>El id de la persona que te invito es: {id}</p>
            <p>Bienvenido, invitado. Por favor, inicia sesión para continuar.</p>
        </div>
    );

};

export default Invitado;


