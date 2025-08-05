// const API_URL = "http://localhost:3001/reservas";
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
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

export const actualizarReserva = async (id, datosActualizados) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizados),
  });
  return await response.json();
};
