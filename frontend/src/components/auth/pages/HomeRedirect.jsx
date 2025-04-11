import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  return null;
};

export default HomeRedirect;
