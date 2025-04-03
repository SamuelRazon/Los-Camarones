import React, { act, useActionState, useState } from 'react'
import './inicioregistro.css'
import { Link } from 'react-router-dom';

const Inicioregistro = () => {
    const [titulo, setTitulo] = useState(true); // Controla el texto (Bienvenido / Inicio de sesión)
    const [mostrarNombre, setMostrarNombre] = useState(false); // Controla la visibilidad del campo Nombre
    const [sesionregistro, setBoton] = useState(false); // Controla el testo del boton inicio de sesion

    const cambiarTexto = () => {
        /* El uso de estos es solamente para cambiar el texto a la otra opcion que esta por defecto instanciada 
        en el div, obteniendo el valor actual y poniendo el distinto al que esta ahorita */
        setTitulo(!titulo); 
        setMostrarNombre(!mostrarNombre); 
        setBoton(!sesionregistro); 
    };

    return (
        <div className='body'> {/* Contenido de todo el diseño*/}
            <div className="container"> {/* Contenido de todo el inicio */}
                <div className='logo'></div> {/* Apartado de la izquierda, el logo */}
                <div className='aside'> {/* Contenido del formulario */}
                    <div className='text'>{titulo ? "Inicio de sesión" : "Registrarse"}</div> {/* Texto que cambiará */}
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
                    
                    <div className='submit-container'> {/* Botones */}
                        
                        <Link to ={'/Dashboard'}>
                            <div className="submit">{sesionregistro ? "Registrarse" : "Iniciar sesión"}</div> {/*Como le muevo para cada uno?*/}
                        </Link>
                        <div className="submit" onClick={cambiarTexto}>{sesionregistro ? "Volver" : "Registrarse"}</div>
                        
                    </div>

                    <div className='forgot-password'> 
                        ¿Olvidaste la contraseña? <br/>
                        <span>Haz click aquí</span>
                    </div>
                </div>
        
            </div>
        </div>
    );
};

export default Inicioregistro;