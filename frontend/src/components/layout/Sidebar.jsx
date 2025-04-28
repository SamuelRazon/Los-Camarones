import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faPlus,
  faShapes,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import DocumentModal from "../configuration/documents/DocumentModal";
import NewCategoryModal from "../../components/configuration/modales/NewCategoryModal";

const Sidebar = ({ setCategoriaSeleccionada }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false); // Nuevo estado

  return (
    <div className="sidebar">
      {/* Botón de nuevo documento */}
      <div className="button" onClick={() => setIsConfigOpen(true)}>
        <FontAwesomeIcon icon={faPlus} className="button-plus" />
        <p>Nuevo Documento</p>
      </div>

      {isConfigOpen && <DocumentModal onClose={() => setIsConfigOpen(false)} />}
      {isNewCategoryOpen && (
        <NewCategoryModal onClose={() => setIsNewCategoryOpen(false)} />
      )}

      <div className="category">
        <FontAwesomeIcon icon={faShapes} className="shapes" />
        <p>Categoría</p>
        <div className="underline"></div>
      </div>

      <div className="subcategory">
        <FontAwesomeIcon icon={faStar} className="star" />
        <p onClick={() => setCategoriaSeleccionada("Docencia")}>Docencia</p>
        <FontAwesomeIcon icon={faStar} className="star" />
        <p onClick={() => setCategoriaSeleccionada("Investigación")}>
          Investigación
        </p>
        <FontAwesomeIcon icon={faStar} className="star" />
        <p onClick={() => setCategoriaSeleccionada("Tutoría")}>Tutoría</p>
        <FontAwesomeIcon icon={faStar} className="star" />
        <p>Clases</p>
        <FontAwesomeIcon icon={faStar} className="star" />
        <p>Gestión</p>

        {/* Botón de nueva categoría */}
        <div className="newcategory" onClick={() => setIsNewCategoryOpen(true)}>
          <div className="underline"></div>
          <FontAwesomeIcon icon={faPlus} className="plus" />
          <p>Añadir Categoría</p>
        </div>
      </div>

      <div className="buttonCV">
        <FontAwesomeIcon icon={faFilePdf} className="move" />
        <p>Generar CV</p>
      </div>
    </div>
  );
};

export default Sidebar;
