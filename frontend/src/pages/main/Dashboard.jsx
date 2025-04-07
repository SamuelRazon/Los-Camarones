import React from 'react'
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleUser} from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
  return (
    <div className='contai'>
      <div className='hea'>
        <div className='top'>
          <div className='picture'>
            <a><FontAwesomeIcon icon={faCircleUser} /></a>
          </div>
          <div className='search'>
              <p>Buscar</p>
              <img src="#" alt="" /> {/* Imagen pendiente */}
          </div>
          <div className='search-deployment'>
              <p>Ciclo</p>
              <img src="#" alt="" /> {/* Imagen pendiente */}
          </div>
          <div className='picture'>
            <a>fotito</a>
          </div>
        </div> {/* Fin de la clase Top */}
        <div className='sidebar'>
          <div className='button'>
              <p>Nuevo Documento</p>
          </div>
          {/* Llamar el componente  */}
          <div className='buttonCV'>
              <p>Generar CV</p>
              <img src="#" alt="" /> {/* Imagen pendiente */}
          </div>
        </div> {/* Fin de la clase sidebar */}
        <div className='main-container'>
          <div className='narbar-mainc'>
            {/* Para cada icons, tendra un propio div, creo*/}
          </div>
        </div> {/* Fin de la clase main-containe*/}
      </div> {/* Fin de la clase header que es solo hea */}
    </div>
  )
}

export default Dashboard