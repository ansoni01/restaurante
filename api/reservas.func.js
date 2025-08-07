let fetch;

async function importFetch() {
  if (!fetch) {
    const { default: fetchModule } = await import('node-fetch');
    fetch = fetchModule;
  }
}
// Configuración de JSONBin
const JSONBIN_BIN_ID = "6893f5ac7b4b8670d8af3a20";
const JSONBIN_API_KEY = "$2a$10$.xSZJNEAl1lqwkPIEPI9Qe9OkJVMqBx0B1XnFhhB1QzdtM3QEqs6m";

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

async function obtenerDatosCompletos() {
  await importFetch();
  
  try {
    const response = await fetch(`${JSONBIN_URL}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    
    const data = await response.json();
    // Asegurar estructura completa con valores por defecto
    return data.record || { usuarios: [], reservas: [] };
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    return { usuarios: [], reservas: [] };
  }
}

async function guardarDatosCompletos(datos) {
  await importFetch();
  
  try {
    const response = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(datos)
    });
    
    if (!response.ok) {
      throw new Error(`Error al guardar datos: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error guardando datos:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    let body = '';
    
    if (req.method === 'POST' || req.method === 'PUT') {
      for await (const chunk of req) body += chunk;
    }

    // Obtener TODOS los datos (reservas + usuarios)
    let datosCompletos = await obtenerDatosCompletos();

    // Asegurar estructura si falta algún campo
    if (!datosCompletos.usuarios) datosCompletos.usuarios = [];
    if (!datosCompletos.reservas) datosCompletos.reservas = [];

    switch(req.method) {
      case 'GET':
        if (id) {
          const reserva = datosCompletos.reservas.find(r => r.id === id);
          if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });
          return res.status(200).json(reserva);
        } else {
          return res.status(200).json(datosCompletos.reservas);
        }

      case 'POST':
        const newReserva = JSON.parse(body);
        
        // Validación
        if (!newReserva.nombre || !newReserva.fecha || !newReserva.hora) {
          return res.status(400).json({ error: "Datos incompletos" });
        }

        // Generar ID y añadir reserva
        newReserva.id = Date.now().toString(36);
        datosCompletos.reservas.push(newReserva);
        
        // Guardar estructura COMPLETA
        await guardarDatosCompletos(datosCompletos);
        return res.status(201).json(newReserva);

      case 'DELETE':
        if (!id) return res.status(400).json({ error: "ID requerido" });
        
        const initialLength = datosCompletos.reservas.length;
        datosCompletos.reservas = datosCompletos.reservas.filter(r => r.id !== id);
        
        if (datosCompletos.reservas.length === initialLength) {
          return res.status(404).json({ error: "Reserva no encontrada" });
        }

        await guardarDatosCompletos(datosCompletos);
        return res.status(204).end();

      case 'PUT':
        if (!id) return res.status(400).json({ error: "ID requerido" });
        
        const updatedData = JSON.parse(body);
        const reservaIndex = datosCompletos.reservas.findIndex(r => r.id === id);
        
        if (reservaIndex === -1) {
          return res.status(404).json({ error: "Reserva no encontrada" });
        }

        // Actualizar solo campos proporcionados
        datosCompletos.reservas[reservaIndex] = {
          ...datosCompletos.reservas[reservaIndex],
          ...updatedData
        };
        
        await guardarDatosCompletos(datosCompletos);
        return res.status(200).json(datosCompletos.reservas[reservaIndex]);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error('Error en la API:', error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
}