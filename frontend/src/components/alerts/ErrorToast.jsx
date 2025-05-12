import React, { useEffect } from "react";
import "./ErrorToast.css"; // Asegúrate de que la ruta sea correcta

const ErrorToast = ({ message }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("errorToast").classList.remove("show");
    }, 3000); // Se oculta después de 3 segundos

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div id="errorToast" className="error-toast show">
      {message}
    </div>
  );
};

export default ErrorToast;
