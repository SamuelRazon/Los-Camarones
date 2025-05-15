import React, { useEffect, useState } from "react";
import "./docu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faQuestionCircle,
  faFileArrowUp,
  faFloppyDisk,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import categoryService from "../../../services/categoryServices";
import documentService from "../../../services/documentServices";
import Loader from "../../Loader";

const DocumentModal = ({ onClose, onDocumentUploaded }) => {
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
  const [isLoading, setIsLoading] = useState(false);

  const categoriaInfo = categorias.find(
    (cat) => cat.nombre === categoriaSeleccionada
  );

  //creado para la animación del modal
  const [isOpen, setIsOpen] = useState(false);

  //creado para la animación del modal
  useEffect(() => {
        setIsOpen(true);
        return () => setIsOpen(false); // Clean-up on unmount
      }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoryService.getCategories();
        const normalizadas = data.map((cat) => ({
          ...cat,
          model: cat.model || "rubrosDefault",
          propiedades: cat.propiedades || [],
          propiedadesTipo: cat.propiedadtipo || [],
          propiedadesObligatorias: cat.propiedadobligatorio || [],
        }));
        setCategorias(normalizadas);
      } catch (error) {
        console.error("No se pudieron cargar las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (categoriaInfo) {
      const camposInicializados = categoriaInfo.propiedades.reduce(
        (acc, prop) => {
          if (prop !== "nombre" && prop !== "fecha") {
            acc[prop] = "";
          }
          return acc;
        },
        {}
      );
      setCamposDinamicos(camposInicializados);
    }
  }, [categoriaInfo]);

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

  const handleGuardar = async () => {
    let erroresTemp = {
      nombre: !nombre.trim(),
      fecha: !fecha,
      dinamicos: {},
    };

    if (categoriaInfo) {
      categoriaInfo.propiedades.forEach((prop, index) => {
        if (["nombre", "fecha"].includes(prop)) return;

        const obligatorio =
          categoriaInfo.propiedadesObligatorias?.[index] || false;
        const tipo = categoriaInfo.propiedadesTipo?.[index] || "string";
        const valor = camposDinamicos[prop];

        if (obligatorio) {
          if (tipo === "boolean" && typeof valor !== "boolean") {
            erroresTemp.dinamicos[prop] =
              "Este campo es obligatorio y debe ser booleano.";
          } else if (tipo !== "boolean" && !String(valor).trim()) {
            erroresTemp.dinamicos[prop] =
              "Este campo es obligatorio y no puede estar vacío.";
          } else {
            erroresTemp.dinamicos[prop] = false;
          }
        }
      });
    }

    setErrores(erroresTemp);

    const hayErrores =
      erroresTemp.nombre ||
      erroresTemp.fecha ||
      Object.values(erroresTemp.dinamicos).some((val) => val);

    if (hayErrores) {
      console.log("Hay errores en el formulario");
      return;
    }

    setIsLoading(true);

    try {
      const propiedadesNombre = [];
      const propiedades = [];

      categoriaInfo.propiedades.forEach((prop) => {
        if (prop === "nombre") {
          propiedadesNombre.push("nombre");
          propiedades.push(nombre);
        } else if (prop === "fecha") {
          propiedadesNombre.push("fecha");
          propiedades.push(fecha);
        } else {
          propiedadesNombre.push(prop);
          propiedades.push(camposDinamicos[prop]);
        }
      });

      const payload = {
        file: archivo || "",
        urldocumento: archivoURL || "",
        rubro: categoriaInfo._id,
        rubroModel: categoriaInfo.model || "rubrosDefault",
        propiedadesNombre,
        propiedades,
      };

      const result = await documentService.uploadDocument(payload);
      console.log("Documento subido con éxito:", result);

      if (onDocumentUploaded && typeof onDocumentUploaded === "function") {
        onDocumentUploaded(result);
      }

      onClose();
    } catch (error) {
      console.error("Error al subir documento:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCamposDinamicos = () => {
    if (!categoriaInfo) return null;

    const mapTipoHTML = (tipo) => {
      switch (tipo) {
        case "string":
          return "text";
        case "number":
          return "number";
        case "date":
          return "date";
        case "boolean":
          return "checkbox";
        default:
          return "text";
      }
    };

    return categoriaInfo.propiedades.map((prop, index) => {
      if (["nombre", "fecha", "urldoc"].includes(prop)) return null;

      const tipoOriginal = categoriaInfo.propiedadesTipo?.[index] || "string";
      const tipoInput = mapTipoHTML(tipoOriginal);
      const obligatorio =
        categoriaInfo.propiedadesObligatorias?.[index] || false;
      const valor =
        camposDinamicos[prop] || (tipoInput === "checkbox" ? false : "");
      const error = errores.dinamicos[prop];

      return (
        <div className="documents-name" key={prop}>
          <p className={error ? "input-error-text" : ""}>
            {prop.charAt(0).toUpperCase() + prop.slice(1)}
            {obligatorio && "*"}:
          </p>
          {tipoInput === "checkbox" ? (
            <input
              type="checkbox"
              className={`documents-input-checkbox ${
                error ? "input-error" : ""
              }`}
              checked={!!valor}
              onChange={(e) =>
                setCamposDinamicos((prev) => ({
                  ...prev,
                  [prop]: e.target.checked,
                }))
              }
            />
          ) : (
            <input
              type={tipoInput}
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
          )}
        </div>
      );
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className={`documents-modal-overlay ${isOpen ? "open" : "closed"}`}>
      <div className={`documents-modal ${isOpen ? "open" : "closed"}`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el overlay
      >
        <div className="documents-top">
          <h3>Nuevo documento</h3>
          <div className="dropbox-category">
            <p>Categoría:</p>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => {
                setCategoriaSeleccionada(e.target.value);
                setCamposDinamicos({});
                setErrores((prev) => ({ ...prev, dinamicos: {} }));
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
          <p className={errores.archivo ? "input-error-text" : ""}>Archivo:</p>
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

          {archivo && archivoURL && (
            <button
              type="button"
              className="show-document"
              onClick={() => window.open(archivoURL, "_blank")}
              style={{ marginLeft: "10px" }}
            >
              <FontAwesomeIcon icon={faEye} className="upload-button" />
            </button>
          )}
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
