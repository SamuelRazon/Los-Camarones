import React from 'react'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className='conta'>
      <div className='top'>
        <img src="" alt="" /> {/* Imagen pendiente */}
        <div className='search'>
            <p>Buscar</p>
            <img src="" alt="" /> {/* Imagen pendiente */}
        </div>
        <div className=''>
            <p>Ciclo</p>
            <img src="" alt="" /> {/* Imagen pendiente */}
        </div>
        <img src="" alt="" /> {/* Imagen pendiente */}
      </div> {/* Fin de la clase Top */}
      <div className='sidebar'>
        <div className='button'>
            <p>Nuevo Documento</p>
        </div>
        {/* Llamar el componente  */}
        <div className='buttonCV'>
            <p>Generar CV</p>
        </div>
      </div> {/* Fin de la clase sidebar */}
      <div className='main-container'>

      </div> {/* Fin de la clase  */}
    </div>
  )
}

export default Dashboard