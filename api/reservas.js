import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // GET: Obtener todas las reservas
    if (req.method === 'GET') {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      const db = JSON.parse(data);
      return res.status(200).json(db.reservas);
    }

    // POST: Crear reserva
    if (req.method === 'POST') {
      const newReserva = req.body;
      const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
      
      newReserva.id = Date.now().toString(36);
      
      if (!newReserva.nombre || !newReserva.fecha || !newReserva.hora) {
        return res.status(400).json({ error: "Datos incompletos" });
      }

      db.reservas.push(newReserva);
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
      return res.status(201).json(newReserva);
    }

    // DELETE: Eliminar reserva
    if (req.method === 'DELETE') {
      const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
      const initialLength = db.reservas.length;
      
      db.reservas = db.reservas.filter(reserva => reserva.id !== id);
      
      if (initialLength === db.reservas.length) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }

      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
      return res.status(204).end();
    }

    // PUT: Actualizar reserva
    if (req.method === 'PUT') {
      const updatedData = req.body;
      const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
      const index = db.reservas.findIndex(reserva => reserva.id === id);
      
      if (index === -1) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }

      db.reservas[index] = { ...db.reservas[index], ...updatedData };
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
      return res.status(200).json(db.reservas[index]);
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error('Error en la API:', error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}