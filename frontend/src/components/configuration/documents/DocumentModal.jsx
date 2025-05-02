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
  const [archivo, setArchivo] = useState(null);
  const [archivoURL, setArchivoURL] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [camposDinamicos, setCamposDinamicos] = useState({});

  const [errores, setErrores] = useState({
    archivo: false,
    nombre: false,
    fecha: false,
    dinamicos: {},
  });

  const categoriaInfo = categorias.find(
    (cat) => cat.nombre === categoriaSeleccionada
  );

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoryService.getCategories();
        const normalizadas = data.map((cat) => ({
          ...cat,
          propiedades: cat.propiedades || [],
          propiedadesTipo: cat.propiedadesTipo || [],
          propiedadesObligatorias: cat.propiedadesObligatorias || [],
        }));
        setCategorias(normalizadas);
      } catch (error) {
        console.error("No se pudieron cargar las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setArchivoURL(URL.createObjectURL(file));
      setErrores((prev) => ({ ...prev, archivo: false }));
    }
  };

  const handleSubirClick = () => {
    document.getElementById("inputArchivo").click();
  };

  const handleGuardar = () => {
    let erroresTemp = {
      archivo: !archivo,
      nombre: !nombre.trim(),
      fecha: !fecha,
      dinamicos: {},
    };

    if (categoriaInfo) {
      categoriaInfo.propiedades.forEach((prop, index) => {
        const obligatorio =
          categoriaInfo.propiedadesObligatorias?.[index] || false;
        if (obligatorio && !camposDinamicos[prop]?.trim()) {
          erroresTemp.dinamicos[prop] = true;
        }
      });
    }

    setErrores(erroresTemp);

    const hayErrores =
      erroresTemp.archivo ||
      erroresTemp.nombre ||
      erroresTemp.fecha ||
      Object.values(erroresTemp.dinamicos).some((val) => val);

    if (hayErrores) return;

    // Aquí va la lógica para enviar al backend
    console.log("Documento válido, listo para enviar.");
  };

  const renderCamposDinamicos = () => {
    if (!categoriaInfo) return null;

    return categoriaInfo.propiedades.map((prop, index) => {
      if (["nombre", "fecha", "urldoc"].includes(prop)) return null;

      const tipo = categoriaInfo.propiedadesTipo?.[index] || "text";
      const obligatorio =
        categoriaInfo.propiedadesObligatorias?.[index] || false;
      const valor = camposDinamicos[prop] || "";
      const error = errores.dinamicos[prop];

      return (
        <div className="documents-name" key={prop}>
          <p className={error ? "input-error-text" : ""}>
            {prop.charAt(0).toUpperCase() + prop.slice(1)}
            {obligatorio && "*"}:
          </p>
          <input
            type={tipo}
            className={`input-name documents-input ${
              error ? "input-error" : ""
            }`}
            value={valor}
            onChange={(e) =>
              setCamposDinamicos((prev) => ({
                ...prev,
                [prop]: e.target.value,
              }))
            }
          />
        </div>
      );
    });
  };

  return (
    <div className="documents-modal-overlay">
      <div className="documents-modal">
        <div className="documents-top">
          <h3>Nuevo documento</h3>
          <div className="dropbox-category">
            <p>Categoría:</p>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => {
                setCategoriaSeleccionada(e.target.value);
                setCamposDinamicos({});
              }}
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
          <p className={errores.archivo ? "input-error-text" : ""}>Archivo:*</p>
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
            className={`input-name ${errores.archivo ? "input-error" : ""}`}
            placeholder="Archivo seleccionado"
            value={archivo?.name || ""}
            readOnly
            style={{ marginLeft: "10px", flex: 2 }}
          />
        </div>

        <div className="documents-name">
          <p className={errores.nombre ? "input-error-text" : ""}>Nombre:*</p>
          <input
            type="text"
            className={`input-name documents-input ${
              errores.nombre ? "input-error" : ""
            }`}
            placeholder="Nombre del documento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="documents-date">
          <p className={errores.fecha ? "input-error-text" : ""}>Fecha:*</p>
          <input
            type="date"
            className={`input-name documents-input ${
              errores.fecha ? "input-error" : ""
            }`}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        {renderCamposDinamicos()}

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
