import Cookies from "js-cookie";

const getCategories = async () => {
  try {
    const token = Cookies.get("token");
    const response = await fetch("http://localhost:5000/api/perCat", {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al obtener categorías");
    return data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
};

const getCategoryById = async (id) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`http://localhost:5000/api/perCat/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al obtener la categoría");
    return data;
  } catch (error) {
    console.error("Error al obtener la categoría por ID:", error);
    throw error;
  }
};

const createCategory = async ({ nombre, propiedades, propiedadesTipo, propiedadesObligatorias }) => {
  try {
    const url = "http://localhost:5000/api/perCat";
    const token = Cookies.get("token");

    const payload = {
      nombre,
      propiedades,
      propiedadtipo: propiedadesTipo,
      propiedadobligatorio: propiedadesObligatorias,
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
      throw new Error(data.error || "No se pudo crear la categoría");
    }

    return data;
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    throw error;
  }
};

const existsCategoryName = async (nombre) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`http://localhost:5000/api/perCat/exists/${encodeURIComponent(nombre)}`, {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al verificar existencia del rubro");
    return data.existe;
  } catch (error) {
    console.error("Error al verificar existencia del rubro:", error);
    throw error;
  }
};

const getRubroById = async (id) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`http://localhost:5000/api/perCat/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Acceso denegado");
      } else if (response.status === 404) {
        throw new Error("Rubro no encontrado");
      } else {
        throw new Error(data.message || "Error al obtener el rubro");
      }
    }

    return data;
  } catch (error) {
    console.error("Error al obtener el rubro por ID:", error);
    throw error;
  }
};

const updateCategory = async (id, { nombre, propiedades, propiedadesTipo, propiedadesObligatorias }) => {
  try {
    const token = Cookies.get("token");

    const payload = {
      nombre,
      propiedades,
      propiedadtipo: propiedadesTipo,
      propiedadesobligatorio: propiedadesObligatorias,
    };

    const response = await fetch(`http://localhost:5000/api/perCat/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo actualizar el rubro");
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar el rubro:", error);
    throw error;
  }
};


const deleteCategory = async (id) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`http://localhost:5000/api/perCat/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo eliminar el rubro");
    }

    return data;
  } catch (error) {
    console.error("Error al eliminar el rubro:", error);
    throw error;
  }
};

const categoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  existsCategoryName,
  getRubroById,
  deleteCategory,
  updateCategory
};

export default categoryService;
