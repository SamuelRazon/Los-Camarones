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
  }, [refresh]);

  const handleSelect = (cat) => {
    if (selectedItem === cat._id) return;
    onSelect(cat._id);
  };

  const handleEdit = (e, cat) => {
    e.stopPropagation();
    setShowUpdateModal(true);
    // Si luego deseas pasarle la categoría para editarla, se puede agregar aquí
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
        <UpdateRubro onClose={() => setShowUpdateModal(false)} />
      )}
    </>
  );
};

export default CategoryList;
