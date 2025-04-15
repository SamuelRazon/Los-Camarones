import React, { useEffect, useState } from "react";
import "../configuration/Modal"; // Reutiliza tus estilos

const TokenExpiryToast = () => {
  const [visible, setVisible] = useState(false);
  const [handlers, setHandlers] = useState({ onExtend: null, onLogout: null });

  useEffect(() => {
    const handleWarning = (e) => {
      setHandlers(e.detail);
      setVisible(true);
    };

    window.addEventListener("token-expiry-warning", handleWarning);
    return () =>
      window.removeEventListener("token-expiry-warning", handleWarning);
  }, []);

  const handleExtend = () => {
    handlers.onExtend?.();
    setVisible(false);
  };

  const handleLogout = () => {
    handlers.onLogout?.();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="confirm-logout-modal">
      <div className="confirm-box">
        <p>Tu sesión está por expirar. ¿Deseas extenderla?</p>
        <div className="confirm-actions">
          <button className="confirm-button" onClick={handleExtend}>
            Sí, extender
          </button>
          <button className="cancel-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryToast;
