import Cookies from "js-cookie";

const createCategory = async ({ nombre, descripcion }) => {
  try {
    const url = "http://localhost:5000/api/rubros";
    const token = Cookies.get("token"); // tomamos el token de la cookie

    const payload = { nombre, descripcion };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // enviamos el token en el header
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo crear la categoría");
    }

    return data;
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    throw error;
  }
};

const categoryService = {
  createCategory,
};

export default categoryService;
