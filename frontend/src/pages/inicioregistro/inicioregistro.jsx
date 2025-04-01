import React, { act, useActionState, useState } from 'react'
import './inicioregistro.css'
import { Link } from 'react-router-dom';

const Inicioregistro = () => {
    const [titulo, setTitulo] = useState(true); // Controla el texto (Bienvenido / Inicio de sesión)
    const [mostrarNombre, setMostrarNombre] = useState(true); // Controla la visibilidad del campo Nombre
    const [sesionregistro, setBoton] = useState(true); // Controla el testo del boton inicio de sesion

    const cambiarTexto = () => {
        /* El uso de estos es solamente para cambiar el texto a la otra opcion que esta por defecto instanciada 
        en el div, obteniendo el valor actual y poniendo el distinto al que esta ahorita */
        setTitulo(!titulo); 
        setMostrarNombre(!mostrarNombre); 
        setBoton(!sesionregistro); 
    };

    return (
        <div className="container"> {/* Contenido de todo el inicio */}
            <div className='header'> {/* Contenido principal */}
                <div className='article'>Camarones</div> {/* Apartado de la izquierda, el logo */}
                <div className='aside'> {/* Contenido del formulario */}
                    <div className='text'>{titulo ? "Bienvenido" : "Inicio de sesión"}</div> {/* Texto que cambiará */}
                    <div className='inputs'>
                        {mostrarNombre && (
                            <div className='input'>
                                <img src="" alt="" /> {/* Imagen pendiente */}
                                <input type="text" placeholder='Nombre' />
                            </div>
                        )}
                        <div className='input'>
                            <img src="" alt="" /> {/* Imagen pendiente */}
                            <input type="email" placeholder='Correo electrónico' />
                        </div>
                        <div className='input'>
                            <img src="" alt="" /> {/* Imagen pendiente */}
                            <input type="password" placeholder='Contraseña' />
                        </div>
                    </div> 
                    <div className='forgot-password'> 
                        ¿Olvidaste la contraseña? <br/>
                        <span>Haz click aquí</span>
                    </div>
                    <div className='submit-container'> {/* Botones */}
                        <div className="submit" onClick={cambiarTexto}>{sesionregistro ? "Inicio de sesión" : "Registro"}</div>
                        <Link to ={'/registro'}>
                            <div className="submit">Login</div> {/*Como le muevo para cada uno?*/}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inicioregistro;