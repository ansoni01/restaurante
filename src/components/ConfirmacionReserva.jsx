// src/components/ConfirmacionReserva.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/confirmacionReserva.css';

const ConfirmacionReserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reserva = location.state;

  if (!reserva) {
    return (
      <div className="confirmacion-contenedor">
        <h2>Error</h2>
        <p>No se encontraron datos de reserva.</p>
        <button className="boton-nueva-reserva" onClick={() => navigate('/')}>
          Volver a inicio
        </button>
      </div>
    );
  }

  return (
    <div className="contenedor">

      <div className='confirmacion'>
        <div className='confirmacion-cabecera'>
          <div className="stat-icon stat-icon--lg bg-success">
            <i className="ti ti-circle-check"></i>
          </div>
          <h2>¡Reserva Confirmada!</h2>
          <p>Tu mesa ha sido reservada exitosamente.</p>
        </div>
        <div className="confirmacion-detalle">
          <div className="detalle-item">
            <i className="ti ti-user"></i>
            <strong>Nombre:</strong>
            <span>{reserva.nombre}</span>
          </div>
          <div className="detalle-item">
            <i className="ti ti-phone"></i>
            <strong>Teléfono:</strong>
            <span>{reserva.telefono}</span>
          </div>
          <div className="detalle-item">
            <i className="ti ti-calendar-event"></i>
            <strong>Fecha:</strong>
            <span>{reserva.fecha}</span>
          </div>
          <div className="detalle-item">
            <i className="ti ti-clock"></i>
            <strong>Hora:</strong>
            <span>{reserva.hora}</span>
          </div>
          <div className="detalle-item">
            <i className="ti ti-chair-director"></i>
            <strong>Mesa:</strong>
            <span>{reserva.mesa}</span>
          </div>
          <div className="detalle-item">
            <i className="ti ti-lock"></i>
            <strong>Código de Confirmación:</strong>
            <span>{reserva.codigo}</span>
          </div>
        </div>
        <button className="boton-nueva-reserva" onClick={() => navigate('/')}>
          Hacer otra reserva
        </button>
        <div className="info-restaurante">
          <p><strong>Restaurante Capulí</strong></p>
          <p>Av. Los Jazmines 1746 – San Isidro – Lima – Perú</p>
          <p>Teléfono: 956 763 253</p>
        </div>
      </div>

    </div>
  );
};

export default ConfirmacionReserva;
