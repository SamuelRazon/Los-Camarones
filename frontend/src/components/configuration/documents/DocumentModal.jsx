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
  const [fecha, setFecha] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [archivoURL, setArchivoURL] = useState("");

  const [errorArchivo, setErrorArchivo] = useState(false);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorFecha, setErrorFecha] = useState(false);

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setArchivoURL(URL.createObjectURL(file));
      setErrorArchivo(false);
    }
  };

  const handleSubirClick = () => {
    document.getElementById("inputArchivo").click();
  };

  const handleGuardar = () => {
    let valid = true;

    if (!archivo) {
      setErrorArchivo(true);
      valid = false;
    } else {
      setErrorArchivo(false);
    }

    if (!nombre.trim()) {
      setErrorNombre(true);
      valid = false;
    } else {
      setErrorNombre(false);
    }

    if (!fecha) {
      setErrorFecha(true);
      valid = false;
    } else {
      setErrorFecha(false);
    }

    if (!valid) return;

    // Aquí iría la lógica para enviar al backend
    console.log("Guardado exitosamente.");
  };

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
            <p className={errorArchivo ? "input-error-text" : ""}>Categoría:</p>
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
          <p className={errorArchivo ? "input-error-text" : ""}>Archivo:*</p>
          <button
            type="button"
            className="newdocuments-button"
            onClick={handleSubirClick}
          >
            <FontAwesomeIcon icon={faFileArrowUp} className="upload-button" />
            Subir
          </button>
          <input
            id="inputArchivo"
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleArchivoChange}
          />
          <input
            type="text"
            className={`input-name ${errorArchivo ? "input-error" : ""}`}
            placeholder="Archivo seleccionado"
            value={archivo?.name || ""}
            readOnly
            style={{ marginLeft: "10px", flex: 2 }}
          />
        </div>

        <div className="documents-name">
          <p className={errorNombre ? "input-error-text" : ""}>Nombre:*</p>
          <input
            type="text"
            className={`input-name documents-input ${
              errorNombre ? "input-error" : ""
            }`}
            placeholder="Nombre del documento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="documents-date">
          <p className={errorFecha ? "input-error-text" : ""}>Fecha:*</p>
          <input
            type="date"
            className={`input-name documents-input ${
              errorFecha ? "input-error" : ""
            }`}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="save-moving">
          <button className="save-documents" onClick={handleGuardar}>
            <FontAwesomeIcon icon={faFloppyDisk} className="moving" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
