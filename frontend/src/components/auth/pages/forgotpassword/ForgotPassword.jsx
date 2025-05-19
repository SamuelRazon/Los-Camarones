import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../../services/authServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Loader";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.sendPasswordResetEmail(email);

      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-body">
      <ToastContainer />
      <div className="forgot-password-container">
        <h2>Recuperar contraseña</h2>
        <p>
          Ingresa tu correo electrónico para recibir un enlace de recuperación.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading} // bloquea input mientras carga
          />
          <button className="submit" type="submit" disabled={loading}>
            Enviar enlace de recuperación
          </button>
        </form>
        <button
          className="back-login-button"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Volver al inicio de sesión
        </button>
      </div>
      {loading && <Loader />} {/* muestra loader si loading es true */}
    </div>
  );
};

export default ForgotPassword;
