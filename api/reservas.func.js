import fs from 'fs/promises';
import path from 'path';
import { URL } from 'url';

const DB_PATH = path.join(process.cwd(), 'db.json');

export default async function handler(req, res) {
  try {
    // Parsear la URL para obtener los parámetros de consulta
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const id = parsedUrl.searchParams.get('id');

    switch(req.method) {
      case 'GET':
        if (id) {
          // GET con ID: reserva específica
          const dbData = await fs.readFile(DB_PATH, 'utf-8');
          const db = JSON.parse(dbData);
          const reserva = db.reservas.find(r => r.id === id);
          
          if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });
          return res.status(200).json(reserva);
        } else {
          // GET sin ID: todas las reservas
          const dbData = await fs.readFile(DB_PATH, 'utf-8');
          const db = JSON.parse(dbData);
          return res.status(200).json(db.reservas);
        }

      case 'POST':
        // Crear nueva reserva
        let body = '';
        for await (const chunk of req) body += chunk;
        const newReserva = JSON.parse(body);
        
        const dbCreate = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
        newReserva.id = Date.now().toString(36);
        
        if (!newReserva.nombre || !newReserva.fecha || !newReserva.hora) {
          return res.status(400).json({ error: "Datos incompletos" });
        }

        dbCreate.reservas.push(newReserva);
        await fs.writeFile(DB_PATH, JSON.stringify(dbCreate, null, 2));
        return res.status(201).json(newReserva);

      case 'DELETE':
        // Eliminar reserva (requiere ID)
        if (!id) return res.status(400).json({ error: "ID requerido" });
        
        const dbDelete = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
        const initialLength = dbDelete.reservas.length;
        dbDelete.reservas = dbDelete.reservas.filter(reserva => reserva.id !== id);
        
        if (initialLength === dbDelete.reservas.length) {
          return res.status(404).json({ error: "Reserva no encontrada" });
        }

        await fs.writeFile(DB_PATH, JSON.stringify(dbDelete, null, 2));
        return res.status(204).end();

      case 'PUT':
        // Actualizar reserva (requiere ID)
        if (!id) return res.status(400).json({ error: "ID requerido" });
        
        let putBody = '';
        for await (const chunk of req) putBody += chunk;
        const updatedData = JSON.parse(putBody);
        
        const dbUpdate = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
        const index = dbUpdate.reservas.findIndex(reserva => reserva.id === id);
        
        if (index === -1) {
          return res.status(404).json({ error: "Reserva no encontrada" });
        }

        dbUpdate.reservas[index] = { ...dbUpdate.reservas[index], ...updatedData };
        await fs.writeFile(DB_PATH, JSON.stringify(dbUpdate, null, 2));
        return res.status(200).json(dbUpdate.reservas[index]);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error('Error en la API:', error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}