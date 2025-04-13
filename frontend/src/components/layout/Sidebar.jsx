import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faPlus,
  faShapes,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

/* Encargado de hacer el diseño de la sección de la izquierda, en donde, por medio del back
 * debería mostrar un contenido especial para cada categoría que se tenga almacenada con sus
 * respetivos documentos, a su vez, se tendrán los botónes que permitan guardar un nuevo documento y
 * crear un CV con formato PDF.
 */
const Sidebar = ({ setCategoriaSeleccionada }) => {
  return (
    <div className="sidebar">
      <div className="button">
        <FontAwesomeIcon icon={faPlus} className="button-plus" />
        <p>Nuevo Documento</p>
      </div>
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
        <div className="newcategory">
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
