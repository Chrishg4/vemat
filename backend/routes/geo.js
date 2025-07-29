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
      // Mejorar detección de IP del ESP32/cliente real
      const clientIP = req.headers['cf-connecting-ip'] ||       // Cloudflare
                      req.headers['x-forwarded-for']?.split(',')[0]?.trim() || // Proxy/Load Balancer
                      req.headers['x-real-ip'] ||                // Nginx
                      req.headers['x-client-ip'] ||              // Apache
                      req.headers['x-cluster-client-ip'] ||      // Cluster
                      req.connection.remoteAddress ||           // Direct connection
                      req.socket.remoteAddress ||               // Socket
                      (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                      req.ip;                                   // Express default
      
      console.log('🌍 IP detectada del ESP32:', clientIP);
      console.log('🔍 Headers de IP disponibles:', {
        'cf-connecting-ip': req.headers['cf-connecting-ip'],
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-real-ip': req.headers['x-real-ip'],
        'x-client-ip': req.headers['x-client-ip'],
        'remoteAddress': req.connection.remoteAddress,
        'req.ip': req.ip
      });
      
      // Limpiar IP si viene con IPv6 wrapper
      let cleanIP = clientIP;
      if (clientIP && clientIP.startsWith('::ffff:')) {
        cleanIP = clientIP.substring(7);
        console.log('🧹 IP limpia (removiendo IPv6 wrapper):', cleanIP);
      }
      
      // Validar que no sea IP privada/local
      const isPrivateIP = !cleanIP || 
                         cleanIP === '127.0.0.1' ||
                         cleanIP === 'localhost' ||
                         cleanIP.startsWith('192.168.') ||
                         cleanIP.startsWith('10.') ||
                         cleanIP.startsWith('172.16.') ||
                         cleanIP.startsWith('::1');
      
      if (isPrivateIP) {
        console.log('⚠️ IP privada/local detectada:', cleanIP, '- usando geolocalización del servidor');
        // Si es IP privada, usar la IP pública del servidor de Render
        const ipResponse = await axios.get('https://ipapi.co/json/');
        lat = ipResponse.data.latitude;
        lng = ipResponse.data.longitude;
        
        console.log('📡 Ubicación del servidor Render:', { 
          lat, lng, 
          city: ipResponse.data.city, 
          country: ipResponse.data.country_name,
          note: 'ESP32 en red privada'
        });
      } else {
        // Usar la IP real del ESP32
        const ipResponse = await axios.get(`https://ipapi.co/${cleanIP}/json/`);
        lat = ipResponse.data.latitude;
        lng = ipResponse.data.longitude;
        
        console.log('📡 Ubicación real por IP del ESP32:', { 
          lat, lng, 
          city: ipResponse.data.city, 
          country: ipResponse.data.country_name,
          ip: cleanIP,
          isp: ipResponse.data.org
        });
      }
      
      if (!lat || !lng) {
        throw new Error('No se pudo obtener ubicación por IP');
      }
      
    } catch (ipError) {
      console.log('⚠️ IP geolocation falló, usando coordenadas por defecto');
      console.log('🔧 Error de IP:', ipError.message);
      
      // Coordenadas por defecto - San José, Costa Rica 🇨🇷
      lat = 9.9281;   // San José, Costa Rica
      lng = -84.0907; // San José, Costa Rica
      
      console.log('📍 Usando coordenadas de Costa Rica por defecto');
    }

    console.log('📍 Usando coordenadas:', { lat, lng });

    const query = `
      INSERT INTO nodos (id, latitud, longitud) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      latitud = VALUES(latitud), 
      longitud = VALUES(longitud),
      updated_at = CURRENT_TIMESTAMP
    `;

    console.log('💾 Actualizando base de datos:', { lat, lng, nodo_id });

    pool.query(query, [nodo_id, lat, lng], (err, results) => {
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
        metodo: 'Geolocalización mejorada por IP',
        precision: 'Ciudad/ISP o Coordenadas de Costa Rica 🇨🇷',
        wifiNetworksDetected: wifiAccessPoints.length,
        ubicacion: lat === 9.9281 ? 'San José, Costa Rica (por defecto)' : 'Detectada por IP'
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
