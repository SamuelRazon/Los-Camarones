import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faGear } from "@fortawesome/free-solid-svg-icons";
import Modal from "../configuration/Modal";
import "./Top.css";
import authService from "../../services/authServices";
import ProfileModal from "../configuration/profile/ProfileModal";
import SearchBar from "../../components/configuration/modales/updatelist/SearchBar";
import documentService from "../../services/documentServices";

const Top = ({
  isConfigOpen,
  setIsConfigOpen,
  setDocuments,
  categoriaSeleccionada,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Estado filtros para persistencia
  const [filters, setFilters] = useState(() => {
    // Leer de localStorage o estado vacío
    const saved = localStorage.getItem("filtrosDashboard");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    fetchProfile();
  }, []);

  // Búsqueda combinada: query + filtros + rubro
  const handleSearch = useCallback(
    async (query, filtrosExternos = {}) => {
      try {
        // Combina filtros del modal + query + rubro
        const filtros = {
          ...filtrosExternos,
          propiedades: query || undefined,
        };

        if (categoriaSeleccionada) {
          filtros.rubro = categoriaSeleccionada;
        }

        // Guardar filtros en estado y localStorage para persistencia
        setFilters(filtros);
        localStorage.setItem("filtrosDashboard", JSON.stringify(filtros));

        const results = await documentService.searchDocuments(filtros);

        console.log("Resultados de búsqueda:", results);
        setDocuments(results);
      } catch (error) {
        console.error("Error en búsqueda de documentos:", error);
      }
    },
    [categoriaSeleccionada, setDocuments]
  );

  const handleProfile = () => {
    if (profileData) {
      setIsProfileOpen(true);
    } else {
      console.warn("Perfil aún no cargado");
    }
  };

  return (
    <div className="top">
      <div className="picture">
        <FontAwesomeIcon
          icon={faCircleUser}
          className="picture-a"
          onClick={handleProfile}
        />
      </div>

      <div className="top-section center">
        <SearchBar onSearch={handleSearch} initialFilters={filters} />
      </div>

      {isProfileOpen && profileData && (
        <ProfileModal
          onClose={() => setIsProfileOpen(false)}
          profile={profileData}
        />
      )}

      <div className="picture">
        <FontAwesomeIcon
          icon={faGear}
          className="picture-gear"
          onClick={() => setIsConfigOpen(true)}
        />
      </div>

      {isConfigOpen && <Modal onClose={() => setIsConfigOpen(false)} />}
    </div>
  );
};

export default Top;
