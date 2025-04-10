import React from 'react'
import './Modal.css';

const Modal = ({ onClose }) => {
  return (
    <div className='configuration-modal'>
      <div className='modal'>
          <h3>Configuración</h3>
          <div className='underlini'></div>
          <div className='mode'> {/*Cambio del modo oscuro (luego buscar como se hace bien esto)*/}
              <p>Modo</p>
              <input type="checkbox" />
              <label>Claro</label>
              <br />
              <input type="checkbox" />
              <label>Oscuro</label>
          </div>
          <div className='lenguaje'>
              <p>Lenguaje</p>
              <select>
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
              </select>
          </div>
          <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
;}

export default Modal
