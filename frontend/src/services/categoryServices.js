import Cookies from "js-cookie";

const createCategory = async ({ nombre, propiedades, propiedadesTipo, propiedadesObligatorias }) => {
  try {
    const url = "http://localhost:5000/api/perCat";
    const token = Cookies.get("token");

    const payload = {
      nombre,
      propiedades,
      propiedadtipo: propiedadesTipo,
      propiedadesobligatorio: propiedadesObligatorias,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
