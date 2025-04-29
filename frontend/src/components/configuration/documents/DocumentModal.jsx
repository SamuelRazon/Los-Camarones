import React, { useState } from "react";
import "./docu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark, 
  faQuestionCircle,
  faFileArrowUp,
  faFloppyDisk
} from "@fortawesome/free-solid-svg-icons";

 /* Encargado de ser de uno de los modales del Sidebar, en donde, se tendra la información para
 * la creación de documentos, de acuerdo al tipo de rubro, archivo, nombre y fecha. 
 */

const DocumentModal = ({ onClose}) => {
    const [nombre, setNombre] = useState("");

    return (
        <div className='documents-modal-overlay'>
            <div className='documents-modal'>
                {/* Encabezado */}
                <div className='documents-top'>
                    <h3>Nuevo documento</h3>
                    <div className="dropbox-category">
                        <p>Categoría:</p>
                        <select name="" id="">
                            <option value="do" defaultChecked> Docencia</option>
                            <option value="in"> Investigación</option>
                            <option value="tu"> Tutorías</option>
                            <option value="cl"> Clases</option>
                            <option value="ge"> Gestión</option>
                        </select>
                    </div>
                    <div className='top-icons'>
                        <FontAwesomeIcon icon={faQuestionCircle} className="helpicon" />
                        {/* Botón de cerrar */}
                        <FontAwesomeIcon
                            icon={faXmark}
                            className="closemodal"
                            title="Cerrar"
                            onClick={onClose}
                        />
                    </div>
                </div>
                {/* Línea horizontal*/}
                <div className="documents-underline"></div>

                {/* Cuerpo */}
                {/* Botón de subir archivo */}
                <div className='newdocument-button'>
                    <p>Archivo: </p>
                    <button className='newdocuments-button'>
                        <FontAwesomeIcon icon={faFileArrowUp} className='upload-button'/> Subir
                    </button>
                </div>
                {/* Escritura del nombre */}
                <div className='documents-name'>
                    <p>Nombre:*</p>
                    <input
                        type="text"
                        className="input-name documents-input"
                        placeholder="Nombre del documento"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                {/* Escritura de la fecha */}
                <div className='documents-date'>
                    <p>--Fecha:*</p>
                    <input
                        type="text"
                        className="input-name documents-input"
                        placeholder="Fecha"
                    />
                </div>
                {/* Botón de guardar */}
                <div className="save-moving"> 
                    <button className='save-documents'>
                        <FontAwesomeIcon icon={faFloppyDisk} className='moving' />Guardar
                    </button>
                </div>
            </div>  {/* Termina el div documents-modal */}
        </div>
  );
};

export default DocumentModal;
