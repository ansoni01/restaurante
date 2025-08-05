// src/components/CalendarioReservas.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendarioReservas.css';
const API_URL = "/api/reservas";

const CalendarioReservas = () => {
  const [fechasReservadas, setFechasReservadas] = useState([]);

  useEffect(() => {
    const cargarFechas = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const fechas = data.map(reserva => reserva.fecha);
        setFechasReservadas(fechas);
      } catch (error) {
        console.error('Error al cargar fechas de reservas:', error);
      }
    };

    cargarFechas();
  }, []);

  const marcarFechas = ({ date, view }) => {
    if (view === 'month') {
      const fechaStr = date.toISOString().split('T')[0]; // formato yyyy-mm-dd
      if (fechasReservadas.includes(fechaStr)) {
        return 'marcado';
      }
    }
    return null;
  };

  return (
    <div className="calendario-contenedor">
      <h3>Días con reservas</h3>
      <Calendar tileClassName={marcarFechas} />
    </div>
  );
};

export default CalendarioReservas;
