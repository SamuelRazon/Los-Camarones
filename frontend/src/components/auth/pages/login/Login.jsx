import React, { useState } from "react";
import "./form.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import authService from "../../../../services/authServices";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Por favor, introduce un correo electrónico válido.");
      return;
    }

    try {
      const data = await authService.loginUser(email, password);
      Cookies.set("token", data.token, { expires: 1, secure: false });
      localStorage.clear();

      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Credenciales inválidas");
    }
  };

  return (
    <div className="body">
      <ToastContainer />
      <div className="container">
        <div className="logo"></div>
        <div className="aside">
          <div className="text">Inicio de sesión</div>
          <form className="inputs" onSubmit={handleSubmit}>
            <div className="input">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="submit-container">
              <button className="submit first-button">Iniciar sesión</button>

              <Link to="/register" className="submit second-button">
                Registrarse
              </Link>
            </div>

            <div className="forgot-password">
              ¿Olvidaste la contraseña? <br />
              <span>Haz click aquí</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
