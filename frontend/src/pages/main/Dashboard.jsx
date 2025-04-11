import React, { useState } from 'react';
import './Dashboard.css';
import Docencia from '../../components/category/Docencia';
import Top from "../../components/layout/Top";
import Sidebar from "../../components/layout/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faBars} from '@fortawesome/free-solid-svg-icons'

/* Dedicado a dar el diseño de la página principal, con los respectivos modales que se iran
* integrando sobre el proceso de cada botón o estilo que tenga cada componente */

/** Inovación para la creación de los modales*/
const Dashboard = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  
  /** Ejemplo de como sería la construcción de la información de las categorías con sus repectivos documentos*/
  const renderCategoria = () => {
    switch (categoriaSeleccionada) {
      case 'Docencia':
        return <Docencia />; {/* Solo existe esta, porque es solo un ejemplo*/}
      case 'Investigación':
        return <Investigacion />; 
      case 'Tutoría':
        return <Tutoría />;
      default:
        return null;
    }
  };


{/*Retorna los componentes que integran la página principal*/}
  return (
    <div className='contai'>
      <div className='hea'>
        <Top isConfigOpen={isConfigOpen} setIsConfigOpen={setIsConfigOpen} /> {/* Invoco el componente */}
        <Sidebar setCategoriaSeleccionada={setCategoriaSeleccionada} /> {/* Invoco el componente */}
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
          {renderCategoria()} {/* Invoco el componente de los documentos con su respectiva categoría */}
        </div> {/* Fin de la clase main-containe*/}
      </div> {/* Fin de la clase header que es solo hea */}
    </div>
  )
};
export default Dashboard