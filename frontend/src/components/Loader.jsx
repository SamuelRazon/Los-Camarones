// components/Loader.jsx
import React from "react";
import "./Loader.css"; // Asegúrate de que la ruta sea correcta

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner" />
    </div>
  );
};

export default Loader;
