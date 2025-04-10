import React, { useState } from 'react';
import './Dashboard.css';
import Docencia from '../../components/category/Docencia';
import Modal from '../../components/configuration/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleUser, faGear, faFilePdf, faTrashCan, faBars, faStar, faShapes, faPlus} from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  

  const renderCategoria = () => {
    switch (categoriaSeleccionada) {
      case 'Docencia':
        return <Docencia />;
      case 'Investigación':
        return <Investigacion />;
      case 'Tutoría':
        return <Tutoría />;
      default:
          return null;
    }
  };


{/*Creado para invocar la página principal, con los contenedores de cada espacio*/}
  return (
    <div className='contai'>
      <div className='hea'>
        <div className='top'>
          <div className='picture'>
            <FontAwesomeIcon icon={faCircleUser} className='picture-a'/>
          </div>
          <div className='search'>
              <p>Buscar</p>
              <img src="#" alt="" /> {/* Cambiar al Icono correspondiente o componenete, idk*/}
          </div>
          <div className='search-deployment'>
              <p>Ciclo</p>
              <img src="#" alt="" /> {/* Imagen pendiente */}
          </div>
          <div className='picture'>
            <FontAwesomeIcon icon={faGear} className='picture-gear'
              onClick={() => setIsConfigOpen(true)} // Al hacer clic en el icono de configuración, abre el modal
            />
          </div>
          {/* Si isConfigOpen es true, mostrar la mini página de configuración */}
          {isConfigOpen && (<Modal onClose={() => setIsConfigOpen(false)} />)}
        </div> {/* Fin de la clase Top */}
        <div className='sidebar'>
          <div className='button'>
              <FontAwesomeIcon icon={faPlus} className='button-plus'/>
              <p>Nuevo Documento</p>
          </div>
          <div className='category'>
              <FontAwesomeIcon icon={faShapes}  className='shapes'/>
             <p>Categoría</p>
             <div className='underline'></div>
          </div> {/* Fin de la clase Category */}
          <div className='subcategory'> {/* Debe cambiar por los componenetes de acuerdo, a lo que seleccione */}
              <FontAwesomeIcon icon={faStar} className='star'/>
              <p onClick={() => setCategoriaSeleccionada('Docencia')}>Docencia</p>
              <FontAwesomeIcon icon={faStar} className='star'/>
              <p>Investigación</p>
              <FontAwesomeIcon icon={faStar} className='star'/>
              <p>Tutoría</p>
              <FontAwesomeIcon icon={faStar} className='star'/>
              <p>Clases</p>
              <FontAwesomeIcon icon={faStar} className='star'/>
              <p>Gestión</p>
            <div className='newcategory'>
                <div className='underline'></div>
                <FontAwesomeIcon icon={faPlus} className='plus'/>
                <p>Añadir Categoría</p>
            </div>
          </div>  {/* Fin de la clase subcategory */}
          <div className='buttonCV'>
              <FontAwesomeIcon icon={faFilePdf} className='move'/>
              <p>Generar CV</p>
          </div>
        </div> {/* Fin de la clase sidebar */}
        <div className='main-container'>
          <div className='narbar-mainc'>
            <dir className='icon-right'>
              <FontAwesomeIcon icon={faBars} className='trash'/>
              <FontAwesomeIcon icon={faTrashCan} className='trash'/>
            </dir>
          </div>
          <div className='speci'>
            <b>Nombre</b>
            <b>Categoría</b>
            <b>Fecha</b>
          </div>
          {renderCategoria()}
        </div> {/* Fin de la clase main-containe*/}
      </div> {/* Fin de la clase header que es solo hea */}
    </div>
  )
};
export default Dashboard