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

 const registerUser = async ({ name, email, password }) => {
  try {
    const url = "http://localhost:5000/api/auth/send_validation_link";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: email, username: name, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "No se pudo enviar el correo de verificación.");
    }

    return await response.json(); // mensaje: 'Correo de validación enviado. Revisa tu bandeja.'
  } catch (error) {
    console.error("Error al enviar correo de verificación:", error);
    throw error;
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

  const sendPasswordResetEmail = async (email) => {
  try {
    const url = "http://localhost:5000/api/auth/send_reset_link";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "No se pudo enviar el correo de recuperación.");
    }

    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error("Error al enviar correo de recuperación:", error);
    throw error;
  }
};
  
const resetPassword = async (newPassword, token) => {
  try {
    const url = "http://localhost:5000/api/auth/reset-password";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al cambiar la contraseña.");
    }

    return data;
  } catch (error) {
    throw error;
  }
};


  const authService = {
    loginUser,
    registerUser,
    isEmailRegister,
    getProfile,
    verifytoken,
    sendPasswordResetEmail,
    resetPassword
  };

  export default authService;