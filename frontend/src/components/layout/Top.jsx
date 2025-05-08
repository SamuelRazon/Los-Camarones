import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faGear } from "@fortawesome/free-solid-svg-icons";
import Modal from "../configuration/Modal";
import "./Top.css";
import authService from "../../services/authServices";
import ProfileModal from "../configuration/profile/ProfileModal";

/*Se encarga de mostrar el contenido de arriba de las opciones, en este caso,
 * la imagen (con su modal), la búsqueda (de los documentos con el back),
 * el ciclo (de los rubros de los documentos con el back),
 * el icon (el de configuración con su modal), y el diseño.
 */

const Top = ({ isConfigOpen, setIsConfigOpen }) => {
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

  return (
    <div className="top">
      <div className="picture">
        <FontAwesomeIcon
          icon={faCircleUser}
          className="picture-a"
          onClick={handleProfile}
        />
      </div>

      {/* Modal de perfil */}
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
