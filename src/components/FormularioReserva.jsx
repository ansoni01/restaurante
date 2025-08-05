// src/components/FormularioReserva.jsx
import React, { useState } from 'react';
import '../styles/formularioReserva.css';
import { useNavigate } from 'react-router-dom';
import CalendarioReservas from './CalendarioReservas';
const API_URL = "/api/reservas";

const FormularioReserva = () => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState('');
  const [mesa, setMesa] = useState('');
  const [error, setError] = useState('');
  const [detalleReservas, setDetalleReservas] = useState([]);
  const navigate = useNavigate();

  const generarCodigoConfirmacion = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    let codigo = '';
    for (let i = 0; i < 3; i++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    codigo += '-';
    for (let i = 0; i < 4; i++) {
      codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    return codigo;
  };

  const navegar = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaReserva = {
      nombre,
      telefono,
      fecha,
      hora,
      personas,
      mesa,
      codigo: generarCodigoConfirmacion(),
      estado: 'Pendiente'
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReserva)
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/confirmacion', { state: data });
      } else {
        alert('Error al registrar la reserva.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('No se pudo conectar con el servidor de reservas.');
    }
  };

  const handleFechaClick = async (fechaSeleccionada) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const reservasEnFecha = data.filter(reserva => reserva.fecha === fechaSeleccionada);
      setDetalleReservas(reservasEnFecha);
    } catch (error) {
      console.error('Error al obtener reservas para la fecha seleccionada:', error);
    }
  };

  return (
    <div className='contenedor'>
      <div className="formulario">

        <div className='breadcrumb'>
          <button onClick={() => navegar('/')} className="btn-circle">
            <i className="ti ti-chevron-left"></i>
          </button>
          <h2>Reservar mesa</h2>
        </div>
        
        <form className='formulario-item' onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              pattern="[0-9]{9}"
              title="Ingrese un número de 9 dígitos"
            />
          </div>
          <div>
            <label>Fecha:</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </div>
          <div>
            <label>Hora:</label>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
          </div>
          <div className="row">
            <div>
              <label>Nro. de personas:</label>
              <input
                type="number"
                min="1"
                value={personas}
                onChange={(e) => setPersonas(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Nro. de mesa:</label>
              <select value={mesa} onChange={(e) => setMesa(e.target.value)} required>
                <option value="">Seleccionar mesa</option>
                <option value="Mesa 1">Mesa 1</option>
                <option value="Mesa 2">Mesa 2</option>
                <option value="Mesa 3">Mesa 3</option>
                <option value="Mesa 4">Mesa 4</option>
                <option value="Mesa 5">Mesa 5</option>
                <option value="Mesa 6">Mesa 6</option>
              </select>
            </div>
          </div>

          {<button type="submit">Confirmar reserva</button>}

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>

        {/* Calendario visual después del formulario */}
        <CalendarioReservas onFechaClick={handleFechaClick} />

        {/* Lista de reservas al hacer clic en una fecha */}
        {detalleReservas.length > 0 && (
          <div className="detalle-reservas">
            <h3>Reservas para la fecha seleccionada:</h3>
            <ul>
              {detalleReservas.map((res, index) => (
                <li key={index}>Mesa: {res.mesa}, Hora: {res.hora}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioReserva;
