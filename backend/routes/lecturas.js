// backend/routes/lecturas.js

const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

/**
 * @swagger
 * /lecturas:
 *   post:
 *     summary: Recibe datos del ESP32
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperatura:
 *                 type: number
 *               humedad:
 *                 type: number
 *               co2:
 *                 type: number
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Lectura guardada
 *       400:
 *         description: Error en los datos
 */
router.post('/', (req, res) => {
  const { temperatura, humedad, co2, timestamp } = req.body;
  const query = 'INSERT INTO lecturas (temperatura, humedad, co2, timestamp) VALUES (?, ?, ?, ?)';
  pool.query(query, [temperatura, humedad, co2, timestamp], (err, results) => {
    if (err) return res.status(400).json({ error: err });
    res.status(201).json({ message: 'Lectura guardada', id: results.insertId });
  });
});

module.exports = router;
