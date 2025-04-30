import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import categoryService from "../../../../services/categoryServices";

const CategoryList = ({ setCategoriaSeleccionada, refresh }) => {
  const [categorias, setCategorias] = useState([]);

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

  return (
    <div className="subcategory">
      {categorias.map((cat) => (
        <div
          key={cat._id}
          className="categoria-item"
          onClick={() => setCategoriaSeleccionada(cat.nombre)}
        >
          <FontAwesomeIcon icon={faStar} className="star" />
          <p>{cat.nombre}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
