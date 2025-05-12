import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlus, faShapes } from "@fortawesome/free-solid-svg-icons";
import DocumentModal from "../configuration/documents/DocumentModal";
import NewCategoryModal from "../../components/configuration/modales/NewCategoryModal";
import CategoryList from "../configuration/modales/updatelist/CategoryList";
import RecentCategoryList from "../configuration/modales/updatelist/RecentCategoryList";
import cvService from "../../services/cvService";
import ErrorToast from "../../components/alerts/ErrorToast";
import Loader from "../../components/Loader";
import "./Sidebar.css";

const Sidebar = ({
  setCategoriaSeleccionada,
  setDocuments,
  selectedDocs,
  clearSelectedDocuments, // <-- recibes la función
}) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [refreshCategorias, setRefreshCategorias] = useState(false);
  const [selectedItem, setSelectedItem] = useState("recientes");

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedItem("recientes");
    setCategoriaSeleccionada(null);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const showErrorToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleNewCategoryClose = () => {
    setIsNewCategoryOpen(false);
    setRefreshCategorias((prev) => !prev);
  };

  const handleSelectRecientes = () => {
    setSelectedItem("recientes");
    setCategoriaSeleccionada(null);
  };

  const handleSelectCategoria = (id) => {
    setSelectedItem(id);
    setCategoriaSeleccionada(id);
  };

  const handleGenerateCV = async () => {
    const selectedIds = selectedDocs.map((doc) => doc._id);
    if (selectedIds.length === 0) {
      showErrorToast("Selecciona al menos un documento para generar el CV.");
      return;
    }

    setIsLoading(true);

    try {
      await cvService.generateRubroPDF(selectedIds);
      clearSelectedDocuments(); // Limpia los checkboxes
      // Puedes agregar un toast de éxito aquí si quieres
    } catch (error) {
      showErrorToast("Hubo un error al generar el PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sidebar">
      {isLoading && <Loader />}
      <div className="sidebar-content">
        {showToast && <ErrorToast message={toastMessage} />}

        <div className="button" onClick={() => setIsConfigOpen(true)}>
          <button>
            <FontAwesomeIcon icon={faPlus} className="button-plus" />
            Nuevo Documento
          </button>
        </div>

        {isConfigOpen && (
          <DocumentModal onClose={() => setIsConfigOpen(false)} />
        )}
        {isNewCategoryOpen && (
          <NewCategoryModal onClose={handleNewCategoryClose} />
        )}

        <div className="category">
          <FontAwesomeIcon icon={faShapes} className="shapes" />
          <p>Rubros</p>
        </div>

        <div className="underline"></div>

        <div className="subcategory">
          <RecentCategoryList
            setDocuments={setDocuments}
            onSelect={handleSelectRecientes}
            isSelected={selectedItem === "recientes"}
          />
        </div>

        <div className="underline"></div>

        <div className="subcategory">
          <CategoryList
            onSelect={handleSelectCategoria}
            refresh={refreshCategorias}
            selectedItem={selectedItem}
          />
        </div>

        <div className="newcategory" onClick={() => setIsNewCategoryOpen(true)}>
          <button>
            <FontAwesomeIcon icon={faPlus} className="plus" />
            Añadir Categoría
          </button>
        </div>

        <br />

        <div>
          <button onClick={handleGenerateCV} className="buttonCV">
            <FontAwesomeIcon icon={faFilePdf} className="move" />
            Generar CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
