import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPen } from "@fortawesome/free-solid-svg-icons";
import categoryService from "../../../../services/categoryServices";
import "./CategoryList.css";
import Loader from "../../../Loader";
import UpdateRubro from "../../modales/updaterubro/UpdateRubro";

const CategoryList = ({ onSelect, refresh, selectedItem }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRubro, setSelectedRubro] = useState(null); // Estado para almacenar el rubro seleccionado

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const data = await categoryService.getCategories();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const handleSelect = (cat) => {
    if (selectedItem === cat._id) return;
    onSelect(cat._id);
  };

  const handleEdit = async (e, cat) => {
    e.stopPropagation();
    setSelectedRubro(cat); // Establecer el rubro seleccionado para pasarlo al modal
    setShowUpdateModal(true); // Mostrar el modal para actualizar
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="subcategory">
        {categorias.map((cat) => (
          <div
            key={cat._id}
            className={`categoria-item ${
              selectedItem === cat._id ? "selected" : ""
            }`}
            onClick={() => handleSelect(cat)}
            style={{
              cursor: selectedItem === cat._id ? "default" : "pointer",
            }}
          >
            <FontAwesomeIcon icon={faStar} className="star" />
            <p>{cat.nombre}</p>
            <FontAwesomeIcon
              icon={faPen}
              className="pen"
              onClick={(e) => handleEdit(e, cat)}
            />
          </div>
        ))}
      </div>

      {showUpdateModal && (
        <UpdateRubro
          onClose={() => setShowUpdateModal(false)}
          rubro={selectedRubro}
          onUpdate={() => {
            setShowUpdateModal(false); // cerrar modal
            if (typeof refresh === "function") refresh(); // notificar al padre
          }}
        />
      )}
    </>
  );
};

export default CategoryList;
