import Cookies from "js-cookie";

const uploadDocument = async ({
  file,
  rubro,
  rubroModel,
  propiedadesNombre,
  propiedades,
}) => {
  try {
    const token = Cookies.get("token");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("rubro", rubro);
    formData.append("rubroModel", rubroModel);
    formData.append("propiedadesnombre", JSON.stringify(propiedadesNombre));
    formData.append("propiedades", JSON.stringify(propiedades));

    const response = await fetch("http://localhost:5000/api/documents/upload", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al subir el documento");
    }

    return data;
  } catch (error) {
    console.error("Error al subir documento:", error);
    throw error;
  }
};

const getAllDocuments = async () => {
  try {
    const token = Cookies.get("token");

    const response = await fetch("http://localhost:5000/api/documents", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener los documentos importados");
    }

    return data;
  } catch (error) {
    console.error("Error al obtener documentos importados:", error);
    throw error;
  }
};

const documentService = {
  uploadDocument,
  getAllDocuments
};

export default documentService;