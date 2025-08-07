let fetch;

async function importFetch() {
  if (!fetch) {
    const { default: fetchModule } = await import('node-fetch');
    fetch = fetchModule;
  }
}

// Configuración de JSONBin
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

export default async function handler(req, res) {
  await importFetch();
  
  try {
    // Obtener parámetros de consulta
    const { usuario, password } = req.query;

    // Validar que se proporcionen usuario y contraseña
    if (!usuario || !password) {
      return res.status(400).json({ error: "Faltan credenciales" });
    }

    // Obtener todos los datos del bin
    const response = await fetch(`${JSONBIN_URL}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'X-Bin-Meta': 'false' // Para obtener solo el contenido
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText}\n${errorBody}`);
    }

    const data = await response.json();
    const usuarios = data.usuarios || [];

    // Buscar el usuario
    const usuarioEncontrado = usuarios.find(u => 
      u.usuario === usuario && u.password === password
    );

    if (usuarioEncontrado) {
      return res.status(200).json([usuarioEncontrado]); // Devuelve un array para mantener consistencia con el frontend
    } else {
      return res.status(200).json([]); // Devuelve array vacío si no encuentra
    }

  } catch (error) {
    console.error('Error en la API de usuarios:', error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
}