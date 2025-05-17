import React, { useState, useEffect } from "react";
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

  const handleProfile = () => {
    if (profileData) {
      setIsProfileOpen(true);
    } else {
      console.warn("Perfil aún no cargado");
    }
  };

  const handleSearch = async (query) => {
    try {
      const filtros = { propiedades: query };

      // Solo agregar el rubro si está seleccionado
      if (categoriaSeleccionada) {
        filtros.rubro = categoriaSeleccionada;
      }

      const results = await documentService.searchDocuments(filtros);

      console.log("Resultados de búsqueda:", results);
      setDocuments(results);
    } catch (error) {
      console.error("Error en búsqueda de documentos:", error);
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
        <SearchBar onSearch={handleSearch} />
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
