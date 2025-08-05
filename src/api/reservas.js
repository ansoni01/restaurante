import { json } from '@vercel/remix';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export async function loader({ request }) {
  const url = new URL(request.url);
  
  // Manejar GET /api/reservas
  if (request.method === 'GET') {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return json(JSON.parse(data).reservas);
  }

  // Manejar POST /api/reservas
  if (request.method === 'POST') {
    const newReserva = await request.json();
    const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    
    newReserva.id = Date.now().toString(36);
    db.reservas.push(newReserva);
    
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
    return json(newReserva, { status: 201 });
  }

  return json({ error: 'Método no permitido' }, { status: 405 });
}