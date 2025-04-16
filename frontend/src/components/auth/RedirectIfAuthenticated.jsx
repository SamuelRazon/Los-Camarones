// components/auth/RedirectIfAuthenticated.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authServices";

const RedirectIfAuthenticated = ({ children }) => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await authService.verifytoken();
        navigate("/dashboard");
      } catch {
        setChecked(true); // Solo muestra los children si el token no es válido
      }
    };

    checkToken();
  }, [navigate]);

  return checked ? children : null;
};

export default RedirectIfAuthenticated;
