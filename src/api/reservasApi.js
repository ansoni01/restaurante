const API_URL = "/api/reservas.func";

// Función para manejar errores de la API
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.error || "Error en la solicitud");
    error.status = response.status;
    throw error;
  }
  return response;
};

export const obtenerReservas = async () => {
  const response = await fetch(API_URL);
  await handleApiError(response);
  return await response.json();
};

export const obtenerReserva = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  await handleApiError(response);
  return await response.json();
};

export const agregarReserva = async (nuevaReserva) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaReserva),
  });
  await handleApiError(response);
  return await response.json();
};

export const eliminarReserva = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { 
    method: "DELETE" 
  });
  await handleApiError(response);
};

export const actualizarReserva = async (id, datosActualizados) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizados),
  });
  await handleApiError(response);
  return await response.json();
};