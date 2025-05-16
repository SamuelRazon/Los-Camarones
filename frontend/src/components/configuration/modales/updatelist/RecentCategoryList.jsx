import React, { useState } from "react";
import documentService from "../../../../services/documentServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../Loader";
import "./RecentCategoryList.css";

const RecentCategoryList = ({ setDocuments, isSelected, onSelect }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    onSelect(); // actualiza la selección visual
    setLoading(true);
    try {
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subcategory">
      <div
        className={`categoria-item ${isSelected ? "selected" : ""}`}
        onClick={handleClick}
        style={{ cursor: isSelected ? "default" : "pointer" }}
      >
        <FontAwesomeIcon icon={faClock} className="star" />
        <p>Recientes</p>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default RecentCategoryList;
