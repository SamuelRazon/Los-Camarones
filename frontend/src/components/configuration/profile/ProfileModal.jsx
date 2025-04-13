import React from "react";
import "./profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faCircleUser,
  faEnvelope,
  faArrowLeft,
  faQuestionCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const ProfileModal = ({ onClose }) => {
  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="perfil-header">
          <div className="perfil-info">
            <FontAwesomeIcon
              icon={faCircleUser}
              className="perfil-avatar-icon"
            />
            <span className="perfil-nombre">Nombre del profesor</span>
          </div>
          <div className="perfil-actions">
            <FontAwesomeIcon
              icon={faPen}
              className="btn-icono editar-perfil"
              title="Editar perfil"
            />
            <FontAwesomeIcon
              icon={faXmark}
              className="btn-icono cerrar-modal"
              title="Cerrar"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="perfil-section"></div>

        <div className="perfil-section">
          <label className="perfil-label">Medios de contacto</label>
          <div className="perfil-contacto-box">
            <FontAwesomeIcon icon={faEnvelope} className="icono-correo" />
            <div className="acciones-contacto">
              <FontAwesomeIcon
                icon={faPen}
                className="btn-icono editar-contacto"
                title="Editar contacto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
