const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

/**
 * @swagger
 * /api/alertas:
 *   get:
 *     summary: Obtener lecturas que superan umbrales de alerta
 *     tags: [Alertas]
 *     parameters:
 *       - in: query
 *         name: nodo_id
 *         schema:
 *           type: string
 *         description: Filtrar por nodo (opcional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de registros a retornar
 *     responses:
 *       200:
 *         description: Lista de lecturas de alerta
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
 *                       fecha:
 *                         type: string
 *                       co2:
 *                         type: number
 *                       temperatura:
 *                         type: number
 *                       humedad:
 *                         type: number
 *                       sonido:
 *                         type: string
 */
router.get('/', (req, res) => {
  const { nodo_id, limit = 50 } = req.query;

  // Umbrales por defecto (ajustables)
  const UMbralCO2 = 1000; // ppm
  const UMbralTemp = 35; // °C
  const UMbralHumedad = 80; // %

  let query = `
    SELECT l.nodo_id, l.timestamp as fecha, l.co2, l.temperatura, l.humedad, l.sonido
    FROM lecturas l
    WHERE (l.co2 >= ? OR l.temperatura >= ? OR l.humedad >= ?)
  `;

  const params = [UMbralCO2, UMbralTemp, UMbralHumedad];

  if (nodo_id) {
    query += ` AND l.nodo_id = ?`;
    params.push(nodo_id);
  }

  query += ` ORDER BY l.timestamp DESC LIMIT ?`;
  params.push(parseInt(limit));

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error(' Error en consulta alertas:', err);
      return res.status(500).json({ success: false, error: 'Error al obtener alertas', details: err.message });
    }

    res.json({ success: true, data: results, total: results.length });
  });
});

module.exports = router;
