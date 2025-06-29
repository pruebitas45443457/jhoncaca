import React from 'react';
import './perfil.css';

function diasDeActividad(creationTime) {
  if (!creationTime) return '-';
  const creacion = new Date(creationTime);
  const ahora = new Date();
  const diff = Math.floor((ahora - creacion) / (1000 * 60 * 60 * 24));
  return diff;
}

function Perfil({ userData }) {
  if (!userData) return <div>Cargando perfil...</div>;
  return (
    <div className="perfil-card">
      <h2>Perfil de Usuario</h2>
      <div className="perfil-info">
        <div className="perfil-info-row">
          <strong>Usuario:</strong>
          <span>{userData.username}</span>
        </div>
        <div className="perfil-info-row">
          <strong>Email:</strong>
          <span>{userData.email}</span>
        </div>
        <div className="perfil-info-row">
          <strong>Fecha de creación:</strong>
          <span>{userData.creationTime ? new Date(userData.creationTime).toLocaleString() : '-'}</span>
        </div>
        <div className="perfil-info-row">
          <strong>Días de actividad:</strong>
          <span>{diasDeActividad(userData.creationTime)}</span>
        </div>
      </div>
    </div>
  );
}

export default Perfil;