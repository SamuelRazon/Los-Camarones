import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faSave,
  faQuestionCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import categoryService from "../../../services/categoryServices";
import "./NewCategoryModal.css";

const NewCategoryModal = ({ onClose }) => {
  const [nombre, setNombre] = useState("");
  const [fields, setFields] = useState([
    { name: "Nombre del archivo", type: "text", required: true },
    { name: "Fecha", type: "date", required: true },
  ]);

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([...fields, { name: "", type: "text", required: false }]);
  };

  const handleDeleteField = (index) => {
    if (index > 1) {
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);
      setFields(updatedFields);
    }
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      toast.warning("Debes ingresar un nombre para el rubro.");
      return;
    }

    const emptyField = fields.find(
      (field, index) => index > 1 && field.name.trim() === ""
    );

    if (emptyField) {
      toast.warning("Todas las propiedades deben tener un nombre.");
      return;
    }

    try {
      const propiedades = fields.map((field) => {
        if (field.name === "Nombre del archivo") return "nombre";
        if (field.name === "Fecha") return "fecha";
        return field.name.toLowerCase().replace(/\s+/g, "_");
      });

      const propiedadesTipo = fields.map((field) =>
        field.type === "text" ? "string" : field.type
      );

      const propiedadesObligatorias = fields.map((field) => field.required);

      await categoryService.createCategory({
        nombre,
        propiedades,
        propiedadesTipo,
        propiedadesObligatorias,
      });

      toast.success("Categoría creada correctamente.");
      onClose();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      toast.error(
        error.message || "Error al guardar la categoría. Intente más tarde."
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="modal-background">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Nueva Categoría</h2>
            <div className="header-icons">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="icon-help btn-icono"
              />
              <FontAwesomeIcon
                icon={faTimes}
                className="icon-close btn-icono"
                onClick={onClose}
              />
            </div>
          </div>

          <hr />

          <label className="perfil-label">Nombre del Rubro*</label>
          <input
            type="text"
            className="input-nombre perfil-email-input"
            placeholder="Nombre del rubro"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          {fields.map((field, index) => (
            <div key={index} className="field-container">
              <input
                type="text"
                className="input-propiedad perfil-email-input"
                value={field.name}
                placeholder={
                  index > 1 && field.name === "" ? "Nueva propiedad" : ""
                }
                disabled={index === 0 || index === 1}
                onChange={(e) =>
                  handleFieldChange(index, "name", e.target.value)
                }
              />

              <select
                className="select-tipo perfil-email-input"
                value={field.type}
                disabled={index === 0 || index === 1}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value)
                }
              >
                <option value="text">Texto</option>
                <option value="date">Fecha</option>
                <option value="number">Número</option>
              </select>

              {index > 1 ? (
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name={`required-${index}`}
                      value="obligatorio"
                      checked={field.required}
                      onChange={() =>
                        handleFieldChange(index, "required", true)
                      }
                    />{" "}
                    Obligatorio
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`required-${index}`}
                      value="opcional"
                      checked={!field.required}
                      onChange={() =>
                        handleFieldChange(index, "required", false)
                      }
                    />{" "}
                    Opcional
                  </label>
                </div>
              ) : (
                <span className="required-fixed">Obligatorio</span>
              )}

              {index > 1 && (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="icon-trash btn-icono"
                  onClick={() => handleDeleteField(index)}
                />
              )}
            </div>
          ))}

          <div className="modal-footer">
            <button className="btn-add btn-icono" onClick={handleAddField}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="btn-save" onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} /> Guardar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCategoryModal;
