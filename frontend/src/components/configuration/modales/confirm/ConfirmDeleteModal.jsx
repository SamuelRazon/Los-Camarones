import React from "react";
import "./ConfirmDeleteModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const ConfirmDeleteModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-background">
      <div className="modal-container confirm-modal">
        <div className="modal-header">
          <h3 className="warning-title">
            <FontAwesomeIcon icon={faExclamationTriangle} /> Advertencia
          </h3>
          <FontAwesomeIcon
            icon={faTimes}
            className="icon-close btn-icono"
            onClick={onCancel}
          />
        </div>
        <hr />
        <p className="confirm-message">{message || "¿Estás seguro?"}</p>
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-confirmar" onClick={onConfirm}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
