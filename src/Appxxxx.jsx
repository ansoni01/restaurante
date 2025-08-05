// Importamos las herramientas necesarias de React y React Router
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos las vistas y componentes principales de la app
import Inicio from './pages/Inicio';
import Administrador from './pages/Administrador';
import FormularioReserva from './components/FormularioReserva';
import ConfirmacionReserva from './components/ConfirmacionReserva';
import SplashScreen from './components/SplashScreen';

// Componente principal de la aplicación
function App() {
  // Estado para controlar si se debe mostrar la pantalla de presentación (splash)
  const [mostrarSplash, setMostrarSplash] = useState(true);

  // Cuando la app inicia, esperamos 3 segundos y ocultamos la pantalla de bienvenida
  useEffect(() => {
    const temporizador = setTimeout(() => {
      setMostrarSplash(false);
    }, 3000);

    // Limpiamos el temporizador cuando el componente se desmonte (buena práctica)
    return () => clearTimeout(temporizador);
  }, []);

  // Si el splash está activo, solo mostramos esa pantalla
  if (mostrarSplash) {
    return <SplashScreen />;
  }

  // Si ya pasaron los 3 segundos, cargamos las rutas normales de la aplicación
  return (
    <Router>
      <Routes>
        {/* Página de inicio donde se elige entre Cliente o Administrador */}
        <Route path="/" element={<Inicio />} />

        {/* Ruta para el formulario de reservas del cliente */}
        <Route path="/cliente" element={<ClienteWrapper />} />

        {/* Ruta para el panel del administrador */}
        <Route path="/admin" element={<Administrador />} />
      </Routes>
    </Router>
  );
}

// Componente auxiliar para manejar el estado de una reserva confirmada
function ClienteWrapper() {
  const [reservaHecha, setReservaHecha] = useState(null);

  return (
    <div>
      {/* Si hay una reserva hecha, mostramos la confirmación */}
      {reservaHecha ? (
        <ConfirmacionReserva reserva={reservaHecha} onNuevaReserva={() => setReservaHecha(null)} />
      ) : (
        // Si no hay reserva aún, mostramos el formulario
        <FormularioReserva onReservaConfirmada={setReservaHecha} />
      )}
    </div>
  );
}

// Exportamos el componente principal
export default App;
