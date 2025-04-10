export const loginUser = async (email, password) => {
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

export const registerUser = async ({ name, email, password, repassword }) => {
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

export const isEmailRegister = async ({ email }) => {
  try {
    const url = "https://localhost:5000//api/auth/check-email";

    const payload = { email };

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
