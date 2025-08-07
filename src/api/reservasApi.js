const API_BASE = "/api/reservas";

export const obtenerReservas = async () => {
  const response = await fetch(API_BASE);
  return await response.json();
};

export const obtenerReserva = async (id) => {
  const response = await fetch(`${API_BASE}?id=${id}`);
  return await response.json();
};

export const agregarReserva = async (nuevaReserva) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaReserva),
  });
  return await response.json();
};

export const eliminarReserva = async (id) => {
  const response = await fetch(`${API_BASE}?id=${id}`, { 
    method: "DELETE" 
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al eliminar reserva");
  }
};

export const actualizarReserva = async (id, datosActualizados) => {
  const response = await fetch(`${API_BASE}?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizados),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al actualizar reserva");
  }
  
  return await response.json();
};