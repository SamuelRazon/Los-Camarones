import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faSave,
  faQuestionCircle,
  faTimes,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import categoryService from "../../../../services/categoryServices";
import "./UpdateRubro.css";
import Loader from "../../../../components/Loader";
import ConfirmDeleteModal from "../confirm/ConfirmDeleteModal";

const UpdateRubro = ({ rubro, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState("");
  const [fields, setFields] = useState([
    { name: "Nombre del archivo", type: "text", required: true },
    { name: "Fecha", type: "date", required: true },
  ]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (rubro) {
      setNombre(rubro.nombre);

      const newFields = rubro.propiedades.map((prop, index) => {
        let displayName = prop;
        if (prop === "nombre") displayName = "Nombre del archivo";
        if (prop === "fecha") displayName = "Fecha";

        let type = "text";
        if (rubro.propiedadtipo[index] === "date") type = "date";
        if (rubro.propiedadtipo[index] === "number") type = "number";

        return {
          name: displayName,
          type,
          required: rubro.propiedadobligatorio[index],
        };
      });

      setFields(newFields);
    }
  }, [rubro]);

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

    setLoading(true);
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

      if (rubro && rubro._id) {
        await categoryService.updateCategory(rubro._id, {
          nombre,
          propiedades,
          propiedadesTipo,
          propiedadesObligatorias,
        });
        toast.success("Rubro actualizado correctamente.");
      } else {
        const yaExiste = await categoryService.existsCategoryName(
          nombre.trim()
        );
        if (yaExiste) {
          toast.warning("Ya existe un rubro con ese nombre.");
          setLoading(false);
          return;
        }

        await categoryService.createCategory({
          nombre,
          propiedades,
          propiedadesTipo,
          propiedadesObligatorias,
        });
        toast.success("Rubro creado correctamente.");
      }

      setIsEditing(false);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al guardar rubro:", error);
      toast.error(
        error.message || "Error al guardar el rubro. Intente más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await categoryService.deleteCategory(rubro._id);
      toast.success("Rubro eliminado correctamente.");
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al eliminar rubro:", error);
      toast.error(
        error.message || "Error al eliminar el rubro. Intente más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading && <Loader />}
      <div className="modal-background">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Actualizar Rubro</h2>
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
            disabled={!isEditing}
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
                disabled={!isEditing || index < 2}
                onChange={(e) =>
                  handleFieldChange(index, "name", e.target.value)
                }
              />

              <select
                className="select-tipo perfil-email-input"
                value={field.type}
                disabled={!isEditing || index < 2}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                  className={`icon-trash btn-icono ${
                    !isEditing ? "disabled" : ""
                  }`}
                  onClick={() => isEditing && handleDeleteField(index)}
                />
              )}
            </div>
          ))}

          {showConfirmModal && (
            <ConfirmDeleteModal
              message="¿Estás seguro de que deseas eliminar este rubro? Esta acción no se puede deshacer."
              onCancel={() => setShowConfirmModal(false)}
              onConfirm={async () => {
                setShowConfirmModal(false);
                await handleDelete();
              }}
            />
          )}

          <div className="modal-footer">
            <button
              className="btn-add btn-icono"
              onClick={handleAddField}
              disabled={!isEditing}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>

            <button
              className="btn-borrar"
              onClick={() => setShowConfirmModal(true)}
              disabled={loading || !rubro?._id}
            >
              <FontAwesomeIcon icon={faTrash} /> Eliminar
            </button>

            <button
              className="btn-editar"
              onClick={() => setIsEditing(true)}
              disabled={loading || isEditing}
            >
              <FontAwesomeIcon icon={faPen} /> Editar
            </button>

            <button
              className="btn-save"
              onClick={handleSave}
              disabled={loading || !isEditing}
            >
              <FontAwesomeIcon icon={faSave} /> Guardar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateRubro;
