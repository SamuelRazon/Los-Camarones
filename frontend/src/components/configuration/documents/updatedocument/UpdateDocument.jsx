import React, { useEffect, useState } from "react";
import "./UpdateDocument.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faQuestionCircle,
  faFileArrowUp,
  faFloppyDisk,
  faEye,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import categoryService from "../../../../services/categoryServices";
import documentService from "../../../../services/documentServices";
import Loader from "../../../Loader";

const UpdateDocument = ({ onClose, onDocumentUploaded, document, rubro }) => {
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
  const [modoEdicion, setModoEdicion] = useState(false);

  const categoriaInfo = categorias.find(
    (cat) => cat.nombre === categoriaSeleccionada
  );

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
    if (categorias.length > 0 && document?.rubro) {
      const categoriaDelDocumento = categorias.find(
        (cat) => cat._id === document.rubro
      );
      if (categoriaDelDocumento) {
        setCategoriaSeleccionada(categoriaDelDocumento.nombre);
      }
    }
  }, [categorias, document]);

  useEffect(() => {
    if (document && rubro) {
      const nombreIndex = document.propiedadesnombre.findIndex(
        (n) => n === "nombre"
      );
      const fechaIndex = document.propiedadesnombre.findIndex(
        (n) => n === "fecha"
      );

      if (nombreIndex !== -1) setNombre(document.propiedades[nombreIndex]);
      if (fechaIndex !== -1) setFecha(document.propiedades[fechaIndex]);

      const camposIniciales = {};
      rubro.propiedades.forEach((prop, index) => {
        if (prop === "nombre" || prop === "fecha") return;
        const propIndex = document.propiedadesnombre.findIndex(
          (n) => n === prop
        );
        const tipo = rubro.propiedadesTipo?.[index] || "string";
        let valor = propIndex !== -1 ? document.propiedades[propIndex] : "";

        if (tipo === "boolean") {
          valor = valor === true || valor === "true";
        }

        camposIniciales[prop] = valor;
      });

      setCamposDinamicos(camposIniciales);
    }
  }, [document, rubro]);

  useEffect(() => {
    if (categoriaInfo) {
      const campos = {};
      categoriaInfo.propiedades.forEach((prop, index) => {
        if (["nombre", "fecha"].includes(prop)) return;
        if (!(prop in camposDinamicos)) {
          const tipo = categoriaInfo.propiedadesTipo?.[index] || "string";
          campos[prop] = tipo === "boolean" ? false : "";
        }
      });
      setCamposDinamicos((prev) => ({ ...campos, ...prev }));
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
        id: document._id, // Asegúrate de enviar el ID para updateDocument
        file: archivo || null, // Si no cambiaste el archivo, pasa null para no modificarlo
        rubro: categoriaInfo._id,
        rubroModel: categoriaInfo.model || "rubrosDefault",
        propiedadesNombre,
        propiedades,
      };

      const result = await documentService.updateDocument(payload);
      console.log("Documento actualizado con éxito:", result);

      if (onDocumentUploaded) onDocumentUploaded(result);

      onClose();
    } catch (error) {
      console.error("Error al actualizar documento:", error.message);
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
        camposDinamicos[prop] ?? (tipoInput === "checkbox" ? false : "");
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
              disabled={!modoEdicion}
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
              disabled={!modoEdicion}
            />
          )}
        </div>
      );
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="documents-modal-overlay">
      <div className="documents-modal">
        {/* TOP BAR */}
        <div className="documents-top">
          <h3>Editar documento</h3>
          <div className="dropbox-category">
            <p>Categoría:</p>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => {
                setCategoriaSeleccionada(e.target.value);
                setCamposDinamicos({});
                setErrores((prev) => ({ ...prev, dinamicos: {} }));
              }}
              disabled={!modoEdicion}
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

        {/* ARCHIVO */}
        <div className="newdocument-button">
          <p className={errores.archivo ? "input-error-text" : ""}>Archivo:</p>
          <button
            type="button"
            className="newdocuments-button"
            onClick={() => document.getElementById("inputArchivo").click()}
            disabled={!modoEdicion}
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
          />
          {archivo && archivoURL && (
            <button
              type="button"
              className="show-document"
              onClick={() => window.open(archivoURL, "_blank")}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          )}
        </div>

        {/* CAMPOS FIJOS */}
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
            disabled={!modoEdicion}
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
            disabled={!modoEdicion}
          />
        </div>

        {/* CAMPOS DINÁMICOS */}
        {renderCamposDinamicos()}

        {/* BOTONES */}
        <div className="save-moving">
          <button className="btn-borrar" disabled={!modoEdicion}>
            <FontAwesomeIcon icon={faTrash} /> Eliminar
          </button>

          <button
            className="btn-editar"
            onClick={() => setModoEdicion(true)}
            disabled={modoEdicion}
          >
            <FontAwesomeIcon icon={faPen} /> Editar
          </button>

          <button
            className="save-documents"
            onClick={handleGuardar}
            disabled={!modoEdicion}
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="moving" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDocument;
