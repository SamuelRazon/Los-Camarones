import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faGear } from "@fortawesome/free-solid-svg-icons";
import Modal from "../configuration/Modal";
import "./Top.css";

/*Se encarga de mostrar el contenido de arriba de las opciones, en este caso,
 * la imagen (con su modal), la búsqueda (de los documentos con el back),
 * el ciclo (de los rubros de los documentos con el back),
 * el icon (el de configuración con su modal), y el diseño.
 */

/*Activa los componentes de acuerdo si el usuario presiona el botón o el icono o el elemento*/
const Top = ({ isConfigOpen, setIsConfigOpen }) => {
  return (
    <div className="top">
      <div className="picture">
        <FontAwesomeIcon icon={faCircleUser} className="picture-a" />
      </div>
      <div className="search">
        <p>Buscar</p>
        <img src="#" alt="" />{" "}
        {/* Aún le falta, pero este es uno de los menús que despliega para ver las opciones */}
      </div>
      <div className="search-deployment">
        <p>Ciclo</p>
        <img src="#" alt="" />{" "}
        {/* Aún le falta, pero este es uno de los menús que despliega para ver las opciones */}
      </div>
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
