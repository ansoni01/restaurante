// src/components/PanelAdmin.jsx
import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import '../styles/panelAdmin.css';
const API_URL = "/api/reservas";

const PanelAdmin = () => {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();
        setReservas(datos);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerReservas();
  }, []);

  if (cargando) {
    return <div className="panel-admin"><p>Cargando reservas...</p></div>;
  }

  return (
    <div className="panel-admin">
      <Dashboard reservas={reservas} />
    </div>
  );
};

export default PanelAdmin;
