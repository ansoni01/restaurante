// src/pages/Administrador.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

function Administrador() {
  const navigate = useNavigate();

  const manejarLoginExitoso = () => {
    navigate('/dashboard'); // Redirige al nuevo Dashboard
  };

  return (
    <div>
      <Login onLoginExitoso={manejarLoginExitoso} />
    </div>
  );
}

export default Administrador;
