import fetch from 'node-fetch';

// Configuración de JSONBin
const JSONBIN_BIN_ID = "6893f5ac7b4b8670d8af3a20";
const JSONBIN_API_KEY = "$2a$10$rWoyDjttFWoh0u8.xztIue4agtREH0Fh3l6Dyy232ycaggVUF9Z3.";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// Función para obtener reservas desde JSONBin
async function obtenerReservas() {
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
    return data.record.reservas || [];
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    return [];
  }
}

// Función para guardar reservas en JSONBin
async function guardarReservas(reservas) {
  try {
    const response = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify({ reservas })
    });
    
    if (!response.ok) {
      throw new Error(`Error al guardar datos: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error guardando reservas:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    let body = '';
    
    // Leer el cuerpo de la solicitud para métodos POST/PUT
    if (req.method === 'POST' || req.method === 'PUT') {
      for await (const chunk of req) body += chunk;
    }

    switch(req.method) {
      case 'GET':
        if (id) {
          // GET con ID: reserva específica
          const reservas = await obtenerReservas();
          const reserva = reservas.find(r => r.id === id);
          
          if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });
          return res.status(200).json(reserva);
        } else {
          // GET sin ID: todas las reservas
          const reservas = await obtenerReservas();
          return res.status(200).json(reservas);
        }

      case 'POST':
        // Crear nueva reserva
        const newReserva = JSON.parse(body);
        const reservas = await obtenerReservas();
        
        // Generar ID único
        newReserva.id = Date.now().toString(36);
        
        // Validar campos obligatorios
        if (!newReserva.nombre || !newReserva.fecha || !newReserva.hora) {
          return res.status(400).json({ error: "Datos incompletos" });
        }

        // Añadir nueva reserva
        reservas.push(newReserva);
        await guardarReservas(reservas);
        return res.status(201).json(newReserva);

      case 'DELETE':
        // Eliminar reserva (requiere ID)
        if (!id) return res.status(400).json({ error: "ID requerido" });
        
        const reservasActuales = await obtenerReservas();
        const nuevasReservas = reservasActuales.filter(reserva => reserva.id !== id);
        
        if (reservasActuales.length === nuevasReservas.length) {
          return res.status(404).json({ error: "Reserva no encontrada" });
        }

        await guardarReservas(nuevasReservas);
        return res.status(204).end();

      case 'PUT':
        // Actualizar reserva (requiere ID)
        if (!id) return res.status(400).json({ error: "ID requerido" });
        
        const updatedData = JSON.parse(body);
        const todasReservas = await obtenerReservas();
        const index = todasReservas.findIndex(reserva => reserva.id === id);
        
        if (index === -1) {
          return res.status(404).json({ error: "Reserva no encontrada" });
        }

        // Actualizar solo los campos proporcionados
        todasReservas[index] = { ...todasReservas[index], ...updatedData };
        await guardarReservas(todasReservas);
        return res.status(200).json(todasReservas[index]);

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