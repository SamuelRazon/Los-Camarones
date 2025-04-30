import React, { useEffect, useState } from "react";
import "./docu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faQuestionCircle,
  faFileArrowUp,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import categoryService from "../../../services/categoryServices";

const DocumentModal = ({ onClose }) => {
  const [nombre, setNombre] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategorias(data);
      } catch (error) {
        console.error("No se pudieron cargar las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="documents-modal-overlay">
      <div className="documents-modal">
        <div className="documents-top">
          <h3>Nuevo documento</h3>
          <div className="dropbox-category">
            <p>Categoría:</p>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="top-icons">
            <FontAwesomeIcon icon={faQuestionCircle} className="helpicon" />
            <FontAwesomeIcon
              icon={faXmark}
              className="closemodal"
              title="Cerrar"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="documents-underline"></div>

        <div className="newdocument-button">
          <p>Archivo: </p>
          <button className="newdocuments-button">
            <FontAwesomeIcon icon={faFileArrowUp} className="upload-button" />{" "}
            Subir
          </button>
        </div>

        <div className="documents-name">
          <p>Nombre:*</p>
          <input
            type="text"
            className="input-name documents-input"
            placeholder="Nombre del documento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="documents-date">
          <p>--Fecha:*</p>
          <input
            type="text"
            className="input-name documents-input"
            placeholder="Fecha"
          />
        </div>

        <div className="save-moving">
          <button className="save-documents">
            <FontAwesomeIcon icon={faFloppyDisk} className="moving" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
