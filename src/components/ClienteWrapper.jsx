// src/components/ClienteWrapper.jsx
import React, { useState } from 'react';
import FormularioReserva from './FormularioReserva';
import ConfirmacionReserva from './ConfirmacionReserva';

const ClienteWrapper = () => {
  const [reservaHecha, setReservaHecha] = useState(null);

  return (
    <div>
      {reservaHecha ? (
        <ConfirmacionReserva
          reserva={reservaHecha}
          onNuevaReserva={() => setReservaHecha(null)}
        />
      ) : (
        <FormularioReserva onReservaConfirmada={setReservaHecha} />
      )}
    </div>
  );
};

export default ClienteWrapper;
