import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlus, faShapes } from "@fortawesome/free-solid-svg-icons";
import DocumentModal from "../configuration/documents/DocumentModal";
import NewCategoryModal from "../../components/configuration/modales/NewCategoryModal";
import CategoryList from "../configuration/modales/updatelist/CategoryList";
import "./Sidebar.css";

const Sidebar = ({ setCategoriaSeleccionada }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [refreshCategorias, setRefreshCategorias] = useState(false);

  const handleNewCategoryClose = () => {
    setIsNewCategoryOpen(false);
    setRefreshCategorias((prev) => !prev);
  };

  return (
    <div className="sidebar">
      <div className="button" onClick={() => setIsConfigOpen(true)}>
        <FontAwesomeIcon icon={faPlus} className="button-plus" />
        <p>Nuevo Documento</p>
      </div>

      {isConfigOpen && <DocumentModal onClose={() => setIsConfigOpen(false)} />}
      {isNewCategoryOpen && (
        <NewCategoryModal onClose={handleNewCategoryClose} />
      )}

      <div className="category">
        <FontAwesomeIcon icon={faShapes} className="shapes" />
        <p>Categoría</p>
      </div>
      <div className="underline"></div>

      {/* Contenedor scrollable para categorías */}
      <div className="subcategory">
        <CategoryList
          setCategoriaSeleccionada={setCategoriaSeleccionada}
          refresh={refreshCategorias}
        />
      </div>

      <div className="newcategory" onClick={() => setIsNewCategoryOpen(true)}>
        <div className="underline"></div>
        <FontAwesomeIcon icon={faPlus} className="plus" />
        <p>Añadir Categoría</p>
      </div>

      <div className="buttonCV">
        <FontAwesomeIcon icon={faFilePdf} className="move" />
        <p>Generar CV</p>
      </div>
    </div>
  );
};

export default Sidebar;
