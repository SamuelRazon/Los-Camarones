import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmailSent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const EmailSent = () => {
  const navigate = useNavigate();

  return (
    <div className="email-sent-body">
      <div className="email-sent-container">
        <FontAwesomeIcon icon={faCircleCheck} className="check-icon bounce" />
        <h2>¡Correo enviado con éxito!</h2>
        <p>Revisa tu bandeja de entrada para verificar tu cuenta.</p>
        <button className="back-button" onClick={() => navigate("/login")}>
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};

export default EmailSent;
