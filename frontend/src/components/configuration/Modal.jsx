import React from "react";
import "./Modal.css";
import logout from "../../components/auth/utils/logout";
import { useNavigate } from "react-router-dom";

/* Dedicado a ser el modal de configuración, en este, se muestran las opciones de cambio de tema y de idioma,
 * por el momento, solo es decorativo. A su vez, le falta el icono de ayuda con explicación de que hace cada cosa
 */
const Modal = ({ onClose }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="configuration-modal">
      <div className="modal">
        <h3>Configuración</h3>
        <div className="underlini"></div>
        <div className="mode">
          {" "}
          {/*Cambio del modo oscuro (luego buscar como se hace bien esto)*/}
          <p>Modo</p>
          <input type="checkbox" />
          <label>Claro</label>
          <br />
          <input type="checkbox" />
          <label>Oscuro</label>
        </div>
        <div className="lenguaje">
          <p>Lenguaje</p>
          <select>
            {" "}
            {/*Cambio de idioma (luego buscar como se hace bien esto)*/}
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </div>
        <button className="button" onClick={onClose}>
          Cerrar
        </button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Modal;
