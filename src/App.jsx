// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClienteWrapper from './components/ClienteWrapper';
import PanelAdmin from './components/PanelAdmin';
import Inicio from './pages/Inicio';
import Administrador from './pages/Administrador';
import ConfirmacionReserva from './components/ConfirmacionReserva';
import Dashboard from './components/Dashboard';
import ListaReservas from './components/ListaReservas'; // Asegúrate de importar esto

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Inicio />} />

        {/* Formulario de cliente */}
        <Route path="/cliente" element={<ClienteWrapper />} />

        {/* Login de administrador */}
        <Route path="/admin" element={<Administrador />} />

        {/* Panel administrativo antiguo (ya no se usa si estás migrando a rutas separadas) */}
        <Route path="/panel-admin" element={<PanelAdmin />} />

        {/* Dashboard solo con KPIs */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Lista completa de reservas */}
        <Route path="/reservas" element={<ListaReservas />} />

        {/* Confirmación de Reservas */}
        <Route path="/confirmacion" element={<ConfirmacionReserva />} />
      </Routes>
    </Router>
  );
}

export default App;
