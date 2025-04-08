import React from 'react';
import './notfound.css'; // Importa el archivo CSS

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">Página no encontrada 😢</p>
        <a href="/" className="notfound-button">Volver al inicio</a>
      </div>
    </div>
  );
};

export default NotFound;