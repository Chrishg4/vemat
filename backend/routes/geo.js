const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const axios = require('axios');

/**
 * @swagger
 * /geo:
 *   post:
 *     summary: Recibe escaneo Wi-Fi y actualiza la ubicación del nodo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nodo_id:
 *                 type: string
 *               wifiAccessPoints:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     macAddress:
 *                       type: string
 *                     signalStrength:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Ubicación actualizada en la tabla de nodos
 *       400:
 *         description: Datos faltantes o error al guardar
 *       500:
 *         description: Error interno al obtener coordenadas
 */

router.post('/', async (req, res) => {
  const { nodo_id, wifiAccessPoints } = req.body;

  if (!nodo_id || !wifiAccessPoints || wifiAccessPoints.length === 0) {
    return res.status(400).json({ error: 'Faltan datos: nodo_id o wifiAccessPoints' });
  }

  try {
    const mozillaURL = 'https://location.services.mozilla.com/v1/geolocate?key=test';
    const response = await axios.post(mozillaURL, { wifiAccessPoints });

    const { lat, lng } = response.data.location;

    const query = `
      UPDATE nodos
      SET latitud = ?, longitud = ?
      WHERE id = ?
    `;

    pool.query(query, [lat, lng, nodo_id], (err, results) => {
      if (err) return res.status(400).json({ error: err });
      res.status(200).json({
        message: 'Ubicación actualizada en nodo',
        nodo_id,
        latitud: lat,
        longitud: lng
      });
    });

  } catch (err) {
    console.error('❌ Error al obtener coordenadas:', err.message);
    res.status(500).json({ error: 'Error procesando geolocalización' });
  }
});

module.exports = router;
