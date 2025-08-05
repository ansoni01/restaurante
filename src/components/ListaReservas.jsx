// src/components/ListaReservas.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/listaReservas.css';
const API_URL = "/api/reservas";

function ListaReservas() {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setReservas(data))
      .catch(error => console.error('Error al cargar reservas:', error));
  }, []);

  const cancelarReserva = async (id) => {
    try {
      const reserva = reservas.find(r => r.id === id);
      const actualizada = { ...reserva, estado: 'Cancelada' };

      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(actualizada)
      });

      setReservas(prev => prev.map(r => r.id === id ? actualizada : r));
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
    }
  };

  const confirmarReserva = async (id) => {
    try {
      const reserva = reservas.find(r => r.id === id);
      const actualizada = { ...reserva, estado: 'Confirmada' };

      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(actualizada)
      });

      setReservas(prev => prev.map(r => r.id === id ? actualizada : r));
      setReservaSeleccionada(null);
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
    }
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    const coincideBusqueda = reserva.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todas' || reserva.estado === filtroEstado;
    const coincideFecha = !filtroFecha || reserva.fecha === filtroFecha;
    return coincideBusqueda && coincideEstado && coincideFecha;
  });

  const exportarCSV = () => {
    const encabezado = ['Nombre', 'Teléfono', 'Fecha', 'Hora', 'Personas', 'Mesa', 'Código', 'Estado'];
    const filas = reservasFiltradas.map((r) => [
      r.nombre,
      r.telefono,
      r.fecha,
      r.hora,
      r.personas,
      r.mesa,
      r.codigo || '-',
      r.estado
    ]);

    const csvContent = [encabezado, ...filas]
      .map((fila) => fila.map((valor) => `"${valor}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'reservas.csv';
    enlace.click();
  };

  return (


    <div className="contenedor">
      <div className='reserva'>
      <div className="reserva-cabecera">
        <div className='breadcrumb'>
          <button onClick={() => navigate('/admin')} className="btn-circle">
            <i className="ti ti-chevron-left"></i>
          </button>
          <h2>Gestión de reservas</h2>
        </div>
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button onClick={() => navigate('/reservas')}>Reservas</button>
      </div>
      <form className="form-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="Confirmada">Confirmadas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Cancelada">Canceladas</option>
          </select>
      </form>

      <button className="exportar-btn" onClick={exportarCSV}>Exportar CSV</button>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Personas</th>
              <th>Mesa</th>
              <th>Código</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.nombre}</td>
                <td>{reserva.telefono}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.hora}</td>
                <td>{reserva.personas}</td>
                <td>{reserva.mesa}</td>
                <td>{reserva.codigo || '-'}</td>
                <td>
                  <span className={`estado ${reserva.estado.toLowerCase()}`}>{reserva.estado}</span>
                </td>
                <td>
                  <div className='acciones'>
                    {reserva.estado !== 'Cancelada' && (
                      <button onClick={() => cancelarReserva(reserva.id)} className="btn-circle btn-circle--sm">
                        <i className="ti ti-trash"></i>
                      </button>
                    )}
                    {reserva.estado === 'Pendiente' && (
                      <button onClick={() => confirmarReserva(reserva.id)} className="btn-circle btn-circle--sm">
                        <i className="ti ti-check"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </div>
    </div>


  );
}

export default ListaReservas;