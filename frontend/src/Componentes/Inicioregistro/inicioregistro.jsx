import React, { act, useActionState } from 'react'
import './inicioregistro.css'

const inicioregistro = () => {
    return (
        <div className="container"> {/*Contenido de todo el inicio*/}
            <div className='header'> {/*Contenido principal*/}
                <div className='article'>Camarones</div>{/*Apartado de la izquierda, el logo*/}
                <div className='aside'>
                    <div className='text'>Bienvenido</div> 
                    <div className='inputs'> {/*Contenido del formulario*/}
                        <div className='input'>
                            <img src="" alt="" /> {/*Cambiar a la imagen que se utilizara*/}
                            <input type="text" placeholder='Nombre'/>
                        </div>
                        <div className='input'>
                            <img src="" alt="" /> {/*Cambiar a la imagen que se utilizara*/}
                            <input type="email" placeholder='Correo electronico' />
                        </div>
                        <div className='input'>
                            <img src="" alt="" /> {/*Cambiar a la imagen que se utilizara*/}
                            <input type="password" placeholder='Contraseña' />
                        </div> {/*Fin del Div class input*/}
                    </div> {/*Fin del Div class inputs*/} 
                        <div className='forgot-password'> ¿Olvidaste la contraseña? <br/>
                            <span>Haz click aquí</span></div>
                    <div className='submit-container'>
                        <div className="submit">Inicio de sesión</div>
                        <div className="submit">Login</div>
                    </div>
                </div>
            </div>
        </div>  
  );
};

export default inicioregistro
