const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

/**
 * @swagger
 * /api/datosAlertas:
 *   get:
 *     summary: Obtener alertas registradas
 *     tags: [datosAlertas]
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
 *         description: Lista de alertas
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
 *                       id:
 *                         type: integer
 *                       nodo_id:
 *                         type: string
 *                       fecha_envio:
 *                         type: string
 *                         format: date-time
 *                       tipo:
 *                         type: string
 *                       detalles:
 *                         type: string
 */
router.get('/', (req, res) => {
  const { nodo_id, limit = 50 } = req.query;

  let query = `
    SELECT id, nodo_id, fecha_envio, tipo, detalles
    FROM alertas
    WHERE 1=1
  `;

  const params = [];

  if (nodo_id) {
    query += ` AND nodo_id = ?`;
    params.push(nodo_id);
  }

  query += ` ORDER BY fecha_envio DESC LIMIT ?`;
  params.push(parseInt(limit));

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error(' Error en consulta datosAlertas:', err);
      return res.status(500).json({ success: false, error: 'Error al obtener alertas', details: err.message });
    }

    res.json({ success: true, data: results, total: results.length });
  });
});

module.exports = router;
