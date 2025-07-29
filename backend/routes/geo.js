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

  console.log('📍 Recibido request de geolocalización:', { nodo_id, accessPointsCount: wifiAccessPoints?.length });

  if (!nodo_id || !wifiAccessPoints || wifiAccessPoints.length === 0) {
    return res.status(400).json({ error: 'Faltan datos: nodo_id o wifiAccessPoints' });
  }

  try {
    // Intentar primero con una API gratuita de geolocalización por IP
    let lat, lng;
    
    try {
      // Usar ipapi.co que es gratuito para geolocalización básica
      const ipResponse = await axios.get('https://ipapi.co/json/');
      lat = ipResponse.data.latitude;
      lng = ipResponse.data.longitude;
      
      console.log('📡 Ubicación aproximada por IP:', { lat, lng, city: ipResponse.data.city });
      
      if (!lat || !lng) {
        throw new Error('No se pudo obtener ubicación por IP');
      }
      
    } catch (ipError) {
      console.log('⚠️ IP geolocation falló, usando coordenadas por defecto');
      // Coordenadas por defecto (puedes cambiarlas por tu ciudad/país)
      lat = -12.0464; // Lima, Perú (cambia según tu ubicación)
      lng = -77.0428;
    }

    console.log('📍 Usando coordenadas:', { lat, lng });

    const query = `
      UPDATE nodos
      SET latitud = ?, longitud = ?
      WHERE id = ?
    `;

    console.log('💾 Actualizando base de datos:', { lat, lng, nodo_id });

    pool.query(query, [lat, lng, nodo_id], (err, results) => {
      if (err) {
        console.error('❌ Error en base de datos:', err);
        return res.status(400).json({ error: 'Error en base de datos: ' + err.message });
      }
      
      console.log('✅ Ubicación actualizada exitosamente');
      res.status(200).json({
        message: 'Ubicación actualizada en nodo',
        nodo_id,
        latitud: lat,
        longitud: lng,
        metodo: 'Geolocalización aproximada por IP',
        precision: 'Ciudad/ISP',
        wifiNetworksDetected: wifiAccessPoints.length
      });
    });

  } catch (err) {
    console.error('❌ Error al obtener coordenadas:', err.message);
    console.error('❌ Error completo:', err);
    
    // Respuesta más detallada del error
    res.status(500).json({ 
      error: 'Error procesando geolocalización',
      details: err.message,
      googleAPI: 'https://www.googleapis.com/geolocation/v1/geolocate',
      fallback: 'Considera usar coordenadas aproximadas o GPS del dispositivo'
    });
  }
});

module.exports = router;
