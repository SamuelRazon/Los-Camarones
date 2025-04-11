import React, { useState } from "react";
import "./form.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  registerUser,
  isEmailRegister,
} from "../../../../services/AuthServices";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const navigate = useNavigate();

  const samePassword = password === repassword;

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const emptyForm = () => {
    return (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      repassword.trim() === ""
    );
  };

  const handleRegister = async () => {
    if (emptyForm()) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Por favor, introduce un correo electrónico válido.");
      return;
    }

    if (!samePassword) {
      toast.error(
        "Las contraseñas no coinciden, verifica e inténtalo de nuevo."
      );
      return;
    }

    const emailExists = await isEmailRegister({ email });
    if (emailExists) {
      toast.error("El correo electrónico ya está registrado.");
      return;
    }

    try {
      await registerUser({ name, email, password, repassword });
      toast.success("Registro exitoso");

      // Limpiar campos
      setName("");
      setEmail("");
      setPassword("");
      setRepassword("");

      // Redirigir si quieres
      // navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error(error.message || "Error al registrar. Intenta nuevamente.");
    }
  };

  return (
    <div className="body">
      <ToastContainer />
      <div className="container">
        <div className="logo"></div>
        <div className="aside">
          <div className="text">Formulario de registro</div>

          <form className="inputs">
            <div className="input">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
              />
            </div>

            <div className="submit-container">
              <button
                className="submit first-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                Registrarse
              </button>

              <Link to="/login" className="submit second-button">
                Volver
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
