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

/* Encargado de hacer el diseño de la sección de la izquierda, en donde, por medio del back
 * debería mostrar un contenido especial para cada categoría que se tenga almacenada con sus
 * respetivos documentos, a su vez, se tendrán los botónes que permitan guardar un nuevo documento y
 * crear un CV con formato PDF.
 */
const Sidebar = ({ setCategoriaSeleccionada }) => {

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div className="sidebar"> {/* Encabezado */}
      {/* Botón de nuevo documento */}
      <div className="button" onClick={() => setIsConfigOpen(true)}>
        <FontAwesomeIcon icon={faPlus} className="button-plus" 
        />
        <p>Nuevo Documento</p>
      </div>

      {/* Activa el modal de nuevo documento */}
      {isConfigOpen && <DocumentModal onClose={() => setIsConfigOpen(false)} />}

      {/* Mostrar los documentos con base a sus respectivas categorías, por el momento, ta raro */}
      <div className="category">
        <FontAwesomeIcon icon={faShapes} className="shapes" />
        <p>Categoría</p>
        <div className="underline"></div>
      </div>
      {/* Cambia la categoría de acuerdo a lo que toques, por el momento, solo es un ejemplo raro */}
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
        <div className="newcategory">
          <div className="underline"></div>
          <FontAwesomeIcon icon={faPlus} className="plus" />
          <p>Añadir Categoría</p>
        </div>
      </div>

      {/* Botón de crear un CV */}
      <div className="buttonCV">
        <FontAwesomeIcon icon={faFilePdf} className="move" />
        <p>Generar CV</p>
      </div>
    </div>
  );
};

export default Sidebar;
