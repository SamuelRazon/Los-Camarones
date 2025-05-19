import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../../../services/authServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Por favor, completa ambos campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (!token) {
      toast.error("Token inválido o ausente.");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPassword(newPassword, token);
      toast.success(response.message || "Contraseña cambiada exitosamente.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Error al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-body">
      <ToastContainer />
      {loading && <Loader />}
      <div className="reset-password-container">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handleSubmit}>
          {[
            {
              placeholder: "Nueva contraseña",
              value: newPassword,
              onChange: setNewPassword,
            },
            {
              placeholder: "Confirmar nueva contraseña",
              value: confirmPassword,
              onChange: setConfirmPassword,
            },
          ].map((input, idx) => (
            <div className="input-group" key={idx}>
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={input.placeholder}
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                disabled={loading}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="toggle-password-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          ))}
          <button className="submit-button" type="submit" disabled={loading}>
            Cambiar contraseña
          </button>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
