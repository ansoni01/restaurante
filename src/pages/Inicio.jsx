import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/inicio.css';

function Inicio() {
  const navegar = useNavigate();

  return (
    <div className="contenedor">
      <div className="inicio">
        <div className="inicio_cabecera">
          <h1>Bienvenido al restaureante Capulí</h1>
          <p>Seleccione una opción para continuar:</p>
        </div>
        <div className="inicio_opciones">
          <button onClick={() => navegar('/cliente')} className="item">
            <i className="ti ti-user"></i>
            <span>Reservar</span>
          </button>
          <button onClick={() => navegar('/admin')} className="item">
          <i className="ti ti-tool"></i>
            <span>Administrar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inicio;


