const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

/**
 * @swagger
 * tags:
 *   - name: Arduino
 *     description: Rutas para ESP32
 *   - name: Vistas
 *     description: Rutas para el frontend
 */

/**
 * @swagger
 * /api/datosLectura:
 *   get:
 *     summary: Obtener datos completos para frontend
 *     description: Combina geolocalización y mediciones de sensores para el dashboard
 *     tags: [Vistas]
 *     parameters:
 *       - in: query
 *         name: nodo_id
 *         schema:
 *           type: string
 *         description: ID específico del nodo (opcional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de registros
 *     responses:
 *       200:
 *         description: Datos combinados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nodo_id:
 *                         type: string
 *                       latitud:
 *                         type: number
 *                       longitud:
 *                         type: number
 *                       ubicacion:
 *                         type: string
 *                       fecha:
 *                         type: string
 *                         format: date-time
 *                       co2:
 *                         type: number
 *                       temperatura:
 *                         type: number
 *                       humedad:
 *                         type: number
 *                       sonido:
 *                         type: string
 *                 total:
 *                   type: integer
 */
router.get('/', (req, res) => {
  const { nodo_id, limit = 50 } = req.query;
  
  let query = `
    SELECT 
      n.id as nodo_id,
      n.latitud,
      n.longitud,
      n.ubicacion,
      l.timestamp as fecha,
      l.co2,
      l.temperatura,
      l.humedad,
      l.sonido
    FROM nodos n
    LEFT JOIN lecturas l ON n.id = l.nodo_id
    WHERE l.timestamp IS NOT NULL
  `;
  
  let queryParams = [];
  
  if (nodo_id) {
    query += ` AND n.id = ?`;
    queryParams.push(nodo_id);
  }
  
  query += ` ORDER BY l.timestamp DESC LIMIT ?`;
  queryParams.push(parseInt(limit));
  
  pool.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(' Error en consulta datosLectura:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Error al obtener datos de lectura',
        details: err.message 
      });
    }
    
    console.log(` DatosLectura: ${results.length} registros encontrados`);
    
    res.json({
      success: true,
      data: results,
      total: results.length,
      timestamp: new Date().toISOString()
    });
  });
});

module.exports = router;