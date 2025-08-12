const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

/**
 * @swagger
 * /api/latlog:
 *   get:
 *     summary: Obtener id, latitud y longitud de todos los nodos
 *     tags: [Vistas]
 *     responses:
 *       200:
 *         description: Lista de nodos con id, latitud y longitud
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
 *                         type: string
 *                       latitud:
 *                         type: number
 *                       longitud:
 *                         type: number
 */
router.get('/', (req, res) => {
	const query = 'SELECT id, latitud, longitud FROM nodos';
	pool.query(query, (err, results) => {
		if (err) {
			console.error('❌ Error en consulta lat&log:', err);
			return res.status(500).json({ success: false, error: 'Error al obtener datos', details: err.message });
		}
		res.json({ success: true, data: results });
	});
});

module.exports = router;
