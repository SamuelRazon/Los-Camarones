import React from 'react'
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleUser} from '@fortawesome/free-solid-svg-icons'
import {faGear} from '@fortawesome/free-solid-svg-icons'
import {faFilePdf} from '@fortawesome/free-solid-svg-icons'
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'
import {faBars} from '@fortawesome/free-solid-svg-icons'

{/*Creado para invocar la página principal, con los contenedores de cada espacio*/}
const Dashboard = () => {
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
            <FontAwesomeIcon icon={faGear} className='picture-gear'/>
          </div>
        </div> {/* Fin de la clase Top */}
        <div className='sidebar'>
          <div className='button'>
              <p>Nuevo Documento</p>
          </div>
          {/* Llamar el componente  */}
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
        </div> {/* Fin de la clase main-containe*/}
      </div> {/* Fin de la clase header que es solo hea */}
    </div>
  )
}

export default Dashboard