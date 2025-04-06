import React, { useState } from 'react';
import './form.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = ({ isLogin, route1, route2 }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleRegister = async () => {
        // Validación
        if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }

        if (!isValidEmail(email)) {
            toast.error('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            const url = isLogin
                ? 'http://localhost:5000/api/auth/login'
                : 'http://localhost:5000/api/auth/register';

            const payload = isLogin
                ? { email, password }
                : { username: name, email, password, foto: '' };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error('Las credenciales proporcionadas no son válidas. Por favor, intenta nuevamente.');
                return;
            }

            if (isLogin) {
                Cookies.set('token', data.token, { expires: 1, secure: false });
                toast.success('Inicio de sesión exitoso');
                navigate('/Dashboard');
            } else {
                toast.success('Registrado con éxito');
                // Limpiar campos
                setName('');
                setEmail('');
                setPassword('');
                navigate(route1);
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error('Error en la petición');
        }
    };

    return (
        <div className='body'>
            <ToastContainer />
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
