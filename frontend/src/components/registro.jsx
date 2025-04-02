import React from 'react'
import './registro.css'

const registro = () => {
  return (
    <div className='cotaineer'>
        <div className='headeer'>
            <div className='textt'> Personaliza tu experiencia</div> 
            <p>Elige las áreas que entran en tu contexto o crea tu propio contexto desde cero.</p>
            <div className='inputss'>
                <div className='inputt'>
                    <h3>Maestro</h3>
                    <img src="" alt="" /> {/* Imagen pendiente */}
                    <p>Información de lo que contendra.</p>
                </div>
                <div className='inputt'>
                    <h3>Investigador</h3>
                    <img src="" alt="" /> {/* Imagen pendiente */}
                    <p>Información de lo que contendra.</p>
                </div>
            </div>
            <div className='center'>
                <div className='submit-containere'> {/* Botones */}
                    <div className="submits">Confirmar</div> 
                    <div className="submits">Personalizar</div>     
                </div>
            </div>
        </div>
    </div>
  )
}

export default registro