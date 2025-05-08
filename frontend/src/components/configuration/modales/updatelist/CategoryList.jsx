import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import categoryService from "../../../../services/categoryServices";
import "./CategoryList.css";
import Loader from "../../../Loader";

const CategoryList = ({ setCategoriaSeleccionada, refresh, selectedItem }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (selectedItem === cat._id) return; // Evitar seleccionar la misma categoría
    setCategoriaSeleccionada(cat._id);
  };

  if (loading) return <Loader />;

  return (
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
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
