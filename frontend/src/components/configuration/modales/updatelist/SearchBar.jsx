import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import FilterModal from "../filter/FilterModal"; // importa el modal
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleFilterApply = (filters) => {
    console.log("Filtros aplicados:", filters);
    // Aquí podrías pasar los filtros al padre si lo necesitas
  };

  return (
    <div className="search-bar">
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
      <input
        type="text"
        placeholder="Buscar documentos..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      <FontAwesomeIcon
        icon={faFilter}
        className="filter-icon"
        onClick={() => setIsFilterOpen(true)}
      />
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default SearchBar;
