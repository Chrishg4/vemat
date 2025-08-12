const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

/**
 * @swagger
 * tags:
 *   - name: Arduino
 *     description: Rutas para ESP32
 */

/**
 * @swagger
 * /api/geo:
 *   post:
 *     summary: Registra nodo con coordenadas fijas
 *     tags: [Arduino]  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nodo_id:
 *                 type: string
 *                 example: "node-01"
 *               latitud:
 *                 type: number
 *                 example: 10.43079
 *               longitud:
 *                 type: number
 *                 example: -85.08499
 *     responses:
 *       200:
 *         description: Nodo registrado exitosamente
 *       400:
 *         description: Datos faltantes o error al guardar
 */

const newRouter = express.Router();

newRouter.post('/', (req, res) => {
  const { nodo_id, latitud, longitud } = req.body;

  console.log('📍 Registrando nodo con coordenadas fijas:', { nodo_id, latitud, longitud });

  // Validar datos requeridos
  if (!nodo_id || latitud === undefined || longitud === undefined) {
    return res.status(400).json({ 
      error: 'Faltan datos requeridos: nodo_id, latitud, longitud' 
    });
  }

  // Insertar/actualizar nodo en base de datos
  const query = `
    INSERT INTO nodos (id, latitud, longitud, activo) 
    VALUES (?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE 
    latitud = VALUES(latitud), 
    longitud = VALUES(longitud),
    activo = VALUES(activo)
  `;

  pool.query(query, [nodo_id, latitud, longitud], (err, results) => {
    if (err) {
      console.error(' Error en base de datos:', err);
      return res.status(400).json({ error: 'Error en base de datos: ' + err.message });
    }
    
    console.log(' ✅ Nodo registrado exitosamente');
    res.status(200).json({
      message: 'Nodo registrado exitosamente',
      nodo_id: nodo_id,
      coordenadas: { latitud, longitud }
    });
  });
});

module.exports = newRouter;
