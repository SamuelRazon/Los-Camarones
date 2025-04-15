import React from "react";
import "./profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faCircleUser,
  faEnvelope,
  faXmark,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ProfileModal = ({ onClose, profile }) => {
  if (!profile) return null;

  const { username, correo } = profile;

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        {/* Botón de cerrar */}
        <FontAwesomeIcon
          icon={faXmark}
          className="cerrar-modal"
          title="Cerrar"
          onClick={onClose}
        />

        {/* Encabezado */}
        <div className="perfil-header">
          <div className="perfil-info">
            <FontAwesomeIcon
              icon={faCircleUser}
              className="perfil-avatar-icon"
            />
            <span className="perfil-nombre">
              {username || "Nombre del profesor"}
            </span>
          </div>

          <div className="perfil-actions">
            <FontAwesomeIcon
              icon={faPen}
              className="btn-icono editar-perfil"
              title="Editar perfil"
            />
          </div>
        </div>

        {/* Semblanza */}
        <div className="perfil-section">
          <label className="perfil-label">Semblanza</label>
          <textarea
            className="perfil-semblanza"
            placeholder="Escribe aquí..."
            disabled
          />
        </div>

        {/* Medios de contacto */}
        <div className="perfil-section">
          <label className="perfil-label">Medios de contacto</label>
          <div className="perfil-contacto-box">
            <FontAwesomeIcon icon={faEnvelope} className="icono-correo" />
            <input
              type="email"
              className="perfil-email-input"
              value={correo || ""}
              disabled
            />
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
