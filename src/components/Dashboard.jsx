// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
const API_URL = "/api/reservas";

function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setReservas(data);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    };

    obtenerReservas();
  }, []);

  const total = reservas.length;
  const confirmadas = reservas.filter(r => r.estado === 'Confirmada').length;
  const canceladas = reservas.filter(r => r.estado === 'Cancelada').length;
  const pendientes = reservas.filter(r => r.estado === 'Pendiente').length;

  return (
    <div className="contenedor">
      <div className='dashboard'>
        <div className="dashboard-cabecera">
          <div className='breadcrumb'>
            <button onClick={() => navigate('/admin')} className="btn-circle">
              <i className="ti ti-chevron-left"></i>
            </button>
            <h2>Resumen de reservas</h2>
          </div>
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          {reservas.length > 0 ? (
            <button onClick={() => navigate('/reservas')}>Reservas</button>
          ) : (
            <p className="aviso">No hay reservas para mostrar.</p>
          )}
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-muted">
              <i className="ti ti-ticket"></i>
            </div>
            <div className="stat-info">
              <p>Reservas totales</p>
              <h2>{total}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-success">
              <i className="ti ti-circle-check"></i>
            </div>
            <div className="stat-info">
              <p>Reservas confirmadas</p>
              <h2>{confirmadas}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-warning">
              <i className="ti ti-alert-triangle"></i>
            </div>
            <div className="stat-info">
              <p>Reservas pendientes</p>
              <h2>{pendientes}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-danger">
              <i className="ti ti-x"></i>
            </div>
            <div className="stat-info">
              <p>Reservas canceladas</p>
              <h2>{canceladas}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

