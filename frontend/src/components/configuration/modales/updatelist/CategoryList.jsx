import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import categoryService from "../../../../services/categoryServices";
import "./CategoryList.css";

const CategoryList = ({ setCategoriaSeleccionada, refresh }) => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, [refresh]);

  const handleSelect = (cat) => {
    if (selectedCategoria === cat.nombre) return;
    setSelectedCategoria(cat.nombre);
    setCategoriaSeleccionada(cat.nombre);
  };

  return (
    <div className="subcategory">
      {categorias.map((cat) => (
        <div
          key={cat._id}
          className={`categoria-item ${
            selectedCategoria === cat.nombre ? "selected" : ""
          }`}
          onClick={() => handleSelect(cat)}
          style={{
            cursor: selectedCategoria === cat.nombre ? "default" : "pointer",
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
