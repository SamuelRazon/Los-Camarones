import React from 'react'
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
    return (
        <div className='documents-modal-overlay'>
            <div className='documents-modal'>
                {/* Encabezado */}
                <div className='documents-top'>
                    <h3>Nuevo documento</h3>
                    {/*Por el momento no estara, pero debe estar aquí el Dropwon, de las categorías
                    * se necesita una extensión para hacerlo, de acuerdo a lo que búsque
                    */}
                    <FontAwesomeIcon icon={faQuestionCircle} className="help-icon" />
                    {/* Botón de cerrar */}
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="cerrar-modal"
                        title="Cerrar"
                        onClick={onClose}
                    />
                </div>
                {/* Línea horizontal*/}
                <div className="documents-underline"></div>

                {/* Cuerpo */}
                {/* Botón de subir archivo */}
                <div className='newdocument-button'>
                    <p>Archivo: </p>
                    <div className='newdocuments-button'>
                        <FontAwesomeIcon icon={faFileArrowUp} className='upload-button'/>
                        <a>Subir</a>
                    </div>
                </div>
                <br />
                {/* Escritura del nombre */}
                <div className='documents-name'>
                    <p>Nombre: </p>
                    <span>
                        {"Agregar texto"}
                    </span>
                </div>
                <br />
                {/* Escritura de la fecha */}
                <div className='documents-date'>
                    <p>Fecha: </p>
                    <span>
                        {"Agregar texto"}
                    </span>
                </div>
                <br />
                {/* Botón de guardar */}
                <div className='save-documents'>
                    <FontAwesomeIcon icon={faFloppyDisk} className='moving' />
                    <p>Guardar</p>
                </div>
            </div>  {/* Termina el div documents-modal */}
        </div>
  );
};

export default DocumentModal;
