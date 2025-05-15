import React, { useState, useEffect } from "react";
import "./Modal.css";
import logout from "../../components/auth/utils/logout";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

/* Dedicado a ser el modal de configuración, en este, se muestran las opciones de cambio de tema y de idioma,
 * por el momento, solo es decorativo. A su vez, le falta el icono de ayuda con explicación de que hace cada cosa
 */

const Modal = ({ onClose }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false); // Estado para mostrar el modal de confirmación

  const handleLogout = () => {
    setShowConfirm(true); // Muestra la alerta personalizada
  };

  const confirmLogout = () => {
    logout(navigate);
  };

  //creado para la animación del modal
  const [isOpen, setIsOpen] = useState(false);

  //creado para la animación del modal
  useEffect(() => {
      setIsOpen(true);
      return () => setIsOpen(false); // Clean-up on unmount
    }, []);

  return (
    <div className={`configuration-modal ${isOpen ? "open" : "closed"}`}>
      <div className={`modal ${isOpen ? "open" : "closed"}`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el overlay
      >
        <div className="modal-header">
          <h3>Configuración</h3>
          <div className="header-icons">
            <FontAwesomeIcon icon={faQuestionCircle} className="help-icon" />
            {/* Icono para cerrar el modal */}
            <FontAwesomeIcon
              icon={faXmark}
              className="close-icon"
              onClick={onClose}
            />
          </div>
        </div>
        <div className="underlini"></div>

        <div className="mode">
          {" "}
          {/*Cambio del modo oscuro (luego buscar como se hace bien esto)*/}
          <p>Modo</p>
          <div className="radioo-group">
            <label>
              <input type="radio" name="modo" value="claro" defaultChecked />
              Claro
            </label>
            <label>
              <input type="radio" name="modo" value="oscuro" />
              Oscuro
            </label>
          </div>
        </div>

        <div className="lenguaje">
          <p>Lenguaje</p>
          <select>
            {" "}
            {/*Cambio de idioma (luego buscar como se hace bien esto)*/}
            <option value="es" defaultChecked>
              Español
            </option>
            <option value="en">Inglés</option>
          </select>
        </div>

        <div className="buttons">
          {/* Solo se deja el botón de cerrar sesión */}
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Alerta personalizada */}
      {showConfirm && (
        <div className="confirm-logout-modal">
          <div className="confirm-box">
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="confirm-actions">
              <button className="confirm-button" onClick={confirmLogout}>
                Sí, cerrar sesión
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
