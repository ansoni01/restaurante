import React, { useState } from 'react';
import '../styles/login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const API_URL = "/api";

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

   try {
      // Usar la ruta relativa para producción
      const apiUrl = `/api/usuarios?usuario=${usuario}&password=${password}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length > 0) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/panel-admin');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      console.error('Error en login:', error);
    }
  
  };

  return (
    <div className='contenedor'>
      <div className="login">

      <div className='breadcrumb'>
        <button onClick={() => navigate('/')} className="btn-circle">
          <i className="ti ti-chevron-left"></i>
        </button>
        <h2>Acceso administrador</h2>
      </div>

        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label>Usuario:</label>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-ingresar">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
