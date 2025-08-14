// backend/routes/lecturas.js

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
 * /api/lecturas:
 *   post:
 *     summary: Recibe datos del ESP32
 *     description: Endpoint para que el ESP32 envíe mediciones de sensores
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
 *                 example: "node-07"
 *               temperatura:
 *                 type: number
 *                 example: 25.3
 *               humedad:
 *                 type: number
 *                 example: 60.2
 *               co2:
 *                 type: number
 *                 example: 400.5
 *               sonido:
 *                 type: number
 *                 example: 1500.5
 *                 description: "Frecuencia de sonido en Hz"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Lectura guardada exitosamente
 *       400:
 *         description: Error en los datos
 */
router.post('/', (req, res) => {
  const { nodo_id, temperatura, humedad, co2, sonido, timestamp } = req.body;
  
  // Verificar que el nodo existe (no lo creamos aquí)
  const checkNodeQuery = 'SELECT id FROM nodos WHERE id = ?';
  
  pool.query(checkNodeQuery, [nodo_id], (checkErr, checkResults) => {
    if (checkErr) {
      console.error(' Error verificando nodo:', checkErr);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (checkResults.length === 0) {
      console.error(' Nodo no encontrado:', nodo_id);
      return res.status(400).json({ 
        error: 'El nodo no existe. Debe registrarse primero en /api/geo',
        nodo_id: nodo_id 
      });
    }
    
    console.log(' Nodo verificado:', nodo_id);
    
    // Insertar la lectura
    const lecturaQuery = 'INSERT INTO lecturas (nodo_id, temperatura, humedad, co2, sonido, timestamp) VALUES (?, ?, ?, ?, ?, ?)';
    
    pool.query(lecturaQuery, [nodo_id, temperatura, humedad, co2, sonido, timestamp || new Date()], (err, results) => {
      if (err) {
        console.error(' Error guardando lectura:', err);
        return res.status(400).json({ error: 'Error al guardar lectura: ' + err.message });
      }
      
      console.log(' Lectura guardada exitosamente:', { nodo_id, id: results.insertId });
      res.status(201).json({ 
        message: 'Lectura guardada exitosamente', 
        id: results.insertId,
        nodo_id: nodo_id 
      });
    });
  });
});

module.exports = router;
