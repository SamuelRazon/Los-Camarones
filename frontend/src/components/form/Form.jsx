import React, { useState } from 'react';
import './form.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Form = ({ isLogin, route1, route2 }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const url = isLogin
                ? 'http://localhost:5000/api/auth/login'
                : 'http://localhost:5000/api/auth/register';

            const payload = isLogin
                ? { email, password }
                : {
                    username: name,
                    email,
                    password,
                    foto: ''
                };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Ocurrió un error');
                return;
            }

            if (isLogin) {
                // Guardar token en cookie
                Cookies.set('token', data.token, { expires: 1, secure: false }); // secure: true en producción con HTTPS
                console.log('Token guardado:', data.token);
                navigate('/Dashboard'); // Redirige al Dashboard después de login
            } else {
                console.log('Usuario registrado:', data.message);
                navigate(route1); // Después del registro, va a login
            }

        } catch (error) {
            console.error('Error:', error);
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
