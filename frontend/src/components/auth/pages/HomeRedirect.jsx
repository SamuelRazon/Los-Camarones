import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Asegúrate de tenerlo instalado

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token"); // o el nombre que uses para el JWT
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login"); // o podrías mostrar algo distinto
    }
  }, []);

  return null; // No muestra nada, solo redirige
};

export default HomeRedirect;
