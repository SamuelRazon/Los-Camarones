import Cookies from "js-cookie";

const generateRubroPDF = async (ids) => {
  try {
    const token = Cookies.get("token");

    const response = await fetch("http://localhost:5000/api/cv/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al generar el PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank"); 

  } catch (error) {
    console.error("Error al generar PDF del rubro:", error);
    throw error;
  }
};

const cvService = {
  generateRubroPDF,
};

export default cvService;
