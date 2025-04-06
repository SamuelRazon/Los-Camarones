import React, { useState } from 'react';
import './form.css';
import { useNavigate } from 'react-router-dom';

const Form = ({ isLogin, route1, route2 }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!isLogin) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: name,
                        email,
                        password,
                        foto: '' // Puedes capturar una URL si luego agregas ese campo
                    })
                });

                const data = await response.json();
                console.log('Respuesta del registro:', data);

                // Redirige después del registro exitoso
                navigate(route1);
            } catch (error) {
                console.error('Error en el registro:', error);
            }
        } else {
            navigate(route1); // Login simulado
        }
    };

    return (
        <div className='body'>
            <div className="container">
                <div className='logo'></div>
                <div className='aside'>
                    <div className='text'>{isLogin ? "Inicio de sesión" : "Registrarse"}</div>
                    <div className='inputs'>
                        {!isLogin && (
                            <div className='input'>
                                <input
                                    type="text"
                                    placeholder='Nombre'
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        )}
                        <div className='input'>
                            <input
                                type="email"
                                placeholder='Correo electrónico'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='input'>
                            <input
                                type="password"
                                placeholder='Contraseña'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='submit-container'>
                        <button className="submit first-button" onClick={handleRegister}>
                            {isLogin ? "Iniciar sesión" : "Registrarse"}
                        </button>
                        <button className="submit second-button" onClick={() => navigate(route2)}>
                            {isLogin ? "Registrarse" : "Volver"}
                        </button>
                    </div>

                    {isLogin && (
                        <div className='forgot-password'>
                            ¿Olvidaste la contraseña? <br />
                            <span>Haz click aquí</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Form;
