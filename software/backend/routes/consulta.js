const express = require('express');
const router = express.Router();
const VEMATAssistant = require('../services/vematAssistant');
const pool = require('../db/connection');

// Inicializar asistente IA
const assistant = new VEMATAssistant();

/**
 * @swagger
 * /api/consulta:
 *   post:
 *     summary: Consultar al asistente IA sobre datos vectoriales
 *     tags: [Vistas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "¿Cuál es el riesgo actual de proliferación de mosquitos?"
 *               incluir_contexto:
 *                 type: boolean
 *                 default: true
 *                 description: "Incluir datos recientes del sensor como contexto"
 *               nodo_id:
 *                 type: string
 *                 example: "node-01"
 *                 description: "ID específico del nodo (opcional)"
 *     responses:
 *       200:
 *         description: Respuesta del asistente IA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 respuesta:
 *                   type: string
 *                 contexto_usado:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *       500:
 *         description: Error interno
 */
router.post('/', async (req, res) => {
  try {
    const { prompt, incluir_contexto = true, nodo_id } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El prompt es requerido'
      });
    }

    let contexto = {};
    if (incluir_contexto) {
      contexto = await obtenerContextoDatos(nodo_id);
      console.log('🔍 Contexto obtenido:', JSON.stringify(contexto, null, 2));
    }

    console.log('📤 Enviando a IA:', { prompt: prompt.substring(0, 50) + '...', contexto_disponible: Object.keys(contexto).length > 0 });
    const respuestaIA = await assistant.procesarConsulta(prompt, contexto);

    // Registrar consulta para estadísticas
    await registrarConsulta(prompt, respuestaIA.success);

    res.json(respuestaIA);

  } catch (error) {
    console.error('❌ Error en endpoint consulta IA:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno procesando consulta',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Obtener datos de contexto para enriquecer la consulta
 */
async function obtenerContextoDatos(nodo_id = null) {
  return new Promise((resolve) => {
    const queryActual = `
      SELECT 
        n.id as nodo_id, n.nombre, n.latitud, n.longitud,
        l.temperatura, l.humedad, l.co2, l.sonido, l.timestamp
      FROM nodos n 
      LEFT JOIN lecturas l ON n.id = l.nodo_id
      WHERE l.timestamp IS NOT NULL
      ${nodo_id ? 'AND n.id = ?' : ''}
      ORDER BY l.timestamp DESC
      LIMIT 1
    `;

    const params = nodo_id ? [nodo_id] : [];

    pool.query(queryActual, params, (err, resultados) => {
      console.log('🗄️ Query resultados:', { 
        error: err?.message, 
        count: resultados?.length,
        query: queryActual.replace(/\s+/g, ' ').trim()
      });
      
      if (err || resultados.length === 0) {
        console.warn('⚠️ No se pudo obtener contexto de datos:', err?.message);
        return resolve({});
      }

      const actual = resultados[0];

      // Obtener histórico reciente
      const queryHistorico = `
        SELECT temperatura, humedad, co2, sonido, timestamp
        FROM lecturas 
        WHERE nodo_id = ?
        ORDER BY timestamp DESC
        LIMIT 10
      `;

      pool.query(queryHistorico, [actual.nodo_id], (errHist, historico) => {
        resolve({
          actual: actual,
          historico: historico || [],
          timestamp: new Date().toISOString()
        });
      });
    });
  });
}

/**
 * Registrar consulta para estadísticas
 */
async function registrarConsulta(prompt, exitosa) {
  console.log('📝 Consulta registrada:', { 
    prompt: prompt.substring(0, 30) + '...', 
    exitosa,
    timestamp: new Date().toISOString() 
  });
}

module.exports = router;
