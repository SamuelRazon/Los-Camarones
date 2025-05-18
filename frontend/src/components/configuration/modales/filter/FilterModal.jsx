import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./FilterModal.css";

const generateCycles = () => {
  const currentYear = new Date().getFullYear();
  const cycles = [];
  for (let year = 1990; year <= currentYear; year++) {
    cycles.push(`${year}-A`);
    cycles.push(`${year}-B`);
  }
  return cycles.reverse();
};

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [cicloEscolar, setCicloEscolar] = useState("");
  const ciclos = generateCycles();

  // Cargar filtros guardados solo si existen cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      const filtrosGuardadosStr = localStorage.getItem("filtrosDashboard");
      if (filtrosGuardadosStr) {
        try {
          const filtrosGuardados = JSON.parse(filtrosGuardadosStr);
          setFechaDesde(filtrosGuardados.fechaDesde || "");
          setFechaHasta(filtrosGuardados.fechaHasta || "");
          setCicloEscolar(filtrosGuardados.cicloEscolar || "");
        } catch {
          setFechaDesde("");
          setFechaHasta("");
          setCicloEscolar("");
        }
      } else {
        setFechaDesde("");
        setFechaHasta("");
        setCicloEscolar("");
      }
    }
  }, [isOpen]);

  const clearField = (field) => {
    if (field === "fechaDesde") setFechaDesde("");
    else if (field === "fechaHasta") setFechaHasta("");
    else if (field === "cicloEscolar") setCicloEscolar("");
  };

  const handleApply = () => {
    const filtrosOriginales = { fechaDesde, fechaHasta, cicloEscolar };

    const clavesProhibidas = ["startDate", "endDate", "ciclo"];

    const nuevosFiltros = Object.fromEntries(
      Object.entries(filtrosOriginales).filter(
        ([key, value]) => value !== "" && !clavesProhibidas.includes(key)
      )
    );

    const filtrosActualesStr = localStorage.getItem("filtrosDashboard");
    let filtrosActuales = {};
    try {
      if (filtrosActualesStr) {
        filtrosActuales = JSON.parse(filtrosActualesStr);
      }
    } catch {
      filtrosActuales = {};
    }

    const filtrosCombinados = { ...filtrosActuales, ...nuevosFiltros };

    localStorage.setItem("filtrosDashboard", JSON.stringify(filtrosCombinados));

    if (typeof window.actualizarFiltrosDashboard === "function") {
      window.actualizarFiltrosDashboard();
    }

    onApply(filtrosCombinados);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar modal"
          title="Cerrar"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2>Filtrar por</h2>

        <div className="filter-field">
          <label>Fecha desde:</label>
          <div className="input-clear-wrapper">
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
            {fechaDesde && (
              <button
                className="clear-field-btn"
                onClick={() => clearField("fechaDesde")}
                title="Quitar filtro fecha desde"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        <div className="filter-field">
          <label>Fecha hasta:</label>
          <div className="input-clear-wrapper">
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
            {fechaHasta && (
              <button
                className="clear-field-btn"
                onClick={() => clearField("fechaHasta")}
                title="Quitar filtro fecha hasta"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        <div className="filter-field">
          <label>Ciclo Escolar:</label>
          <div className="scrollable-select-wrapper">
            <select
              size="5"
              value={cicloEscolar}
              onChange={(e) => setCicloEscolar(e.target.value)}
            >
              {ciclos.map((ciclo, idx) => (
                <option key={idx} value={ciclo}>
                  {ciclo}
                </option>
              ))}
            </select>
            {cicloEscolar && (
              <button
                className="clear-field-btn select-clear-btn"
                onClick={() => clearField("cicloEscolar")}
                title="Quitar filtro ciclo escolar"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        <div className="modal-buttons">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleApply}>Aplicar</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
