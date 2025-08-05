const API_URL = "/api/reservas";

export const obtenerReservas = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const agregarReserva = async (nuevaReserva) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaReserva),
  });
  return await response.json();
};

export const eliminarReserva = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { 
    method: "DELETE" 
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al eliminar reserva");
  }
};

export const actualizarReserva = async (id, datosActualizados) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizados),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al actualizar reserva");
  }
  
  return await response.json();
};