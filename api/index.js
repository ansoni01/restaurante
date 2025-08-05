import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export default async function handler(req, res) {
  try {
    // Manejar GET /api/reservas
    if (req.method === 'GET') {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      const db = JSON.parse(data);
      return res.status(200).json(db.reservas);
    }

    // Manejar POST /api/reservas
    if (req.method === 'POST') {
      const newReserva = req.body;
      const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
      
      // Generar ID único
      newReserva.id = Date.now().toString(36);
      
      // Validar campos obligatorios
      if (!newReserva.nombre || !newReserva.fecha || !newReserva.hora) {
        return res.status(400).json({ error: "Datos incompletos" });
      }

      db.reservas.push(newReserva);
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
      return res.status(201).json(newReserva);
    }

    // Método no soportado
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error('Error en la API:', error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}