import Cookies from "js-cookie";
  
  const loginUser = async (email, password) => {
    try {
      const url = "http://localhost:5000/api/auth/login";

      const payload = { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales inválidas");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async ({ name, email, password, repassword }) => {
    try {
      const url = "http://localhost:5000/api/auth/register";

      const payload = { username: name, email, password, repassword, foto: "" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isEmailRegister = async ({ email }) => {
    try {
      const url = "http://localhost:5000/api/auth/check-email";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return data.exists === true;
    } catch (error) {
      console.error("Error al verificar el email:", error);
      return false; 
    }
  };

  const getProfile = async () => {
    try {
      const token = Cookies.get("token"); // tomamos el token de la cookie
  
      const response = await fetch("http://localhost:5000/api/auth/perfil", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // lo enviamos en el header Authorization
        },
      });
  
      if (!response.ok) {
        throw new Error("No se pudo obtener el perfil");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      throw error;
    }
  };

  const verifytoken = async () => {
    try {
      const token = Cookies.get("token"); // tomamos el token de la cookie
  
      const response = await fetch("http://localhost:5000/api/auth/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // lo enviamos en el header Authorization
        },
      });
  
      if (!response.ok) {
        throw new Error("No se pudo obtener el token o el token es inválido");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener el token:", error);
      throw error;
    }
  };
  

  const authService = {
    loginUser,
    registerUser,
    isEmailRegister,
    getProfile,
    verifytoken
  };

  export default authService;