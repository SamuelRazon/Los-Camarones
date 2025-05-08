import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlus, faShapes } from "@fortawesome/free-solid-svg-icons";
import DocumentModal from "../configuration/documents/DocumentModal";
import NewCategoryModal from "../../components/configuration/modales/NewCategoryModal";
import CategoryList from "../configuration/modales/updatelist/CategoryList";
import RecentCategoryList from "../configuration/modales/updatelist/RecentCategoryList";
import "./Sidebar.css";

const Sidebar = ({ setCategoriaSeleccionada, setDocuments }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [refreshCategorias, setRefreshCategorias] = useState(false);
  const [selectedItem, setSelectedItem] = useState("recientes");

  useEffect(() => {
    setSelectedItem("recientes");
    setCategoriaSeleccionada(null);
  }, []);

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

  return (
    <div className="sidebar">
      <div className="sidebar-content">
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

        <div className="buttonCV">
          <FontAwesomeIcon icon={faFilePdf} className="move" />
          <button>Generar CV</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
