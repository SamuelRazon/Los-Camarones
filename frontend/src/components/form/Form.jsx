import React from 'react'
import './form.css'
import { Link } from 'react-router-dom';

const Form = ({isLogin, route1, route2}) => {
    
    return (
        <div className='body'> {/* Contenido de todo el diseño*/}
            <div className="container"> {/* Contenido de todo el inicio */}
                <div className='logo'></div> {/* Apartado de la izquierda, el logo */}
                <div className='aside'> {/* Contenido del formulario */}
                    <div className='text'>{isLogin ? "Inicio de sesión" : "Registrarse"}</div> {/* Texto que cambiará */}
                    <div className='inputs'>
                        {!isLogin && (
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
                        
                        <Link to ={route1}>
                            <div className="submit first-button">{isLogin ? "Iniciar sesión": "Registrarse" }</div> {/*Como le muevo para cada uno?*/}
                        </Link>
                        <Link to ={route2}>
                            <div className="submit second-button">{isLogin ? "Registrarse" : "Volver"}</div>
                        </Link>
                        
                        
                    </div>

                    {isLogin && (
                        <div className='forgot-password'> 
                        ¿Olvidaste la contraseña? <br/>
                        <span>Haz click aquí</span>
                        </div>
                    )}

                    
                </div>
        
            </div>
        </div>
    );
};

export default Form;