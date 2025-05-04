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
      // Inicializar campos dinámicos con valores predeterminados vacíos
      const camposInicializados = categoriaInfo.propiedades.reduce(
        (acc, prop) => {
          if (prop !== "nombre" && prop !== "fecha") {
            acc[prop] = ""; // Inicializar solo campos dinámicos
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

  const handleGuardar = () => {
    // Verificar valores de los inputs antes de proceder
    console.log("Valor de nombre:", nombre);
    console.log("Valor de fecha:", fecha);
    console.log("Archivo seleccionado:", archivo?.name);
    console.log("Campos dinámicos:", camposDinamicos);

    // Validar errores antes de actualizar el estado
    let erroresTemp = {
      archivo: !archivo,
      nombre: !nombre.trim(),
      fecha: !fecha,
      dinamicos: {},
    };

    if (categoriaInfo) {
      categoriaInfo.propiedades.forEach((prop, index) => {
        if (prop === "nombre" || prop === "fecha") return; // Saltar los campos estáticos

        const obligatorio =
          categoriaInfo.propiedadesObligatorias?.[index] || false;
        const tipo = categoriaInfo.propiedadesTipo?.[index] || "string";
        const valor = camposDinamicos[prop] || ""; // Asegurarse de que el valor no sea undefined

        // Verificar si el campo es obligatorio
        if (obligatorio) {
          if (tipo === "boolean" && typeof valor !== "boolean") {
            erroresTemp.dinamicos[prop] =
              "Este campo es obligatorio y debe ser un valor booleano.";
          } else if (tipo !== "boolean" && !String(valor).trim()) {
            erroresTemp.dinamicos[prop] =
              "Este campo es obligatorio y no puede estar vacío.";
          } else {
            erroresTemp.dinamicos[prop] = false; // Si pasa la validación
          }
        }
      });
    }

    // Ahora actualizamos los errores en el estado
    setErrores(erroresTemp);

    // Evaluar si hay errores antes de proceder
    const hayErrores =
      erroresTemp.archivo ||
      erroresTemp.nombre ||
      erroresTemp.fecha ||
      Object.values(erroresTemp.dinamicos).some((val) => val);

    if (hayErrores) {
      console.log("Hay errores en el formulario");
      return;
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
