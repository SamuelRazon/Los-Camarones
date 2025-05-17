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

const downloadDocument = async (id) => {
  try {
    const token = Cookies.get("token");

    const response = await fetch(`http://localhost:5000/api/cats/download/${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la URL de descarga");
    }

    const data = await response.json();
    const downloadUrl = data.downloadUrl;

    window.open(downloadUrl, "_self"); 

  } catch (error) {
    console.error("Error al descargar documento:", error);
    throw error;
  }
};

const getDocumentByID = async (id) => {
  try {
    const token = Cookies.get("token");

    const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener el documento por ID");
    }

    return data;
  } catch (error) {
    console.error("Error al obtener documento por ID:", error);
    throw error;
  }
};

const updateDocument = async ({
  id,
  file,
  rubro,
  rubroModel,
  propiedadesNombre,
  propiedades,
}) => {
  try {
    const token = Cookies.get("token");

    const formData = new FormData();

    if (file) formData.append("file", file);
    if (rubro) formData.append("rubro", rubro);
    if (rubroModel) formData.append("rubroModel", rubroModel);
    if (propiedadesNombre) formData.append("propiedadesnombre", JSON.stringify(propiedadesNombre));
    if (propiedades) formData.append("propiedades", JSON.stringify(propiedades));

    const response = await fetch(`http://localhost:5000/api/documents/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar el documento");
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar documento:", error);
    throw error;
  }
};

const deleteDocument = async (id) => {
  try {
    // Verificar que haya un ID válido
    if (!id) {
      throw new Error('ID de documento no válido');
    }

    // Obtener el token
    const token = Cookies.get("token");
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Log para debugging
    console.log('Intentando eliminar documento:', { id, token });

    const response = await fetch(`http://localhost:5000/api/documents/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    // Log de la respuesta
    console.log('Respuesta del servidor:', response.status);

    const data = await response.json();
    console.log("Respuesta de la API:", data);

    // Manejar respuesta no exitosa
    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar el documento");
    }

    // Si todo sale bien, retornar los datos
    return data;

  } catch (error) {
    // Log detallado del error
    console.error("Error al eliminar documento:", {
      message: error.message,
      stack: error.stack
    });
    
    // Re-lanzar el error para manejarlo en el componente
    throw error;
  }
};

const searchDocuments = async ({ rubro, propiedades, ciclo, startDate,endDate }) => {
  try {
    const token = Cookies.get("token");

    const params = new URLSearchParams();

    if (rubro) params.append("rubro", rubro);
    if (propiedades) params.append("propiedades", propiedades); 
    if (ciclo) params.append("ciclo", ciclo);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate); 
  

    const response = await fetch(`http://localhost:5000/api/documents/?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al buscar documentos con filtros");
    }

    return data;
  } catch (error) {
    console.error("Error en búsqueda de documentos:", error);
    throw error;
  }
};


const documentService = {
  uploadDocument,
  getAllDocuments,
  downloadDocument,
  getDocumentByID,
  updateDocument,
  deleteDocument,
  searchDocuments
};

export default documentService;