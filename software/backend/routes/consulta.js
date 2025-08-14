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
    // Obtener la lectura más reciente
    const queryReciente = `
      SELECT 
        l.nodo_id,
        l.temperatura, l.humedad, l.co2, l.sonido, l.timestamp
      FROM lecturas l 
      WHERE l.timestamp IS NOT NULL
      ${nodo_id ? 'AND l.nodo_id = ?' : ''}
      ORDER BY l.timestamp DESC
      LIMIT 1
    `;

    const params = nodo_id ? [nodo_id] : [];

    pool.query(queryReciente, params, (err, resultadosRecientes) => {
      console.log('🗄️ Query lectura reciente:', { 
        error: err?.message, 
        count: resultadosRecientes?.length
      });
      
      if (err || resultadosRecientes.length === 0) {
        console.warn('⚠️ No se pudo obtener contexto de datos:', err?.message);
        return resolve({});
      }

      const lecturaReciente = resultadosRecientes[0];
      const nodo_target = lecturaReciente.nodo_id;

      // Obtener información del nodo
      pool.query('SELECT * FROM nodos WHERE id = ?', [nodo_target], (errNodo, nodoResult) => {
        const nodo = nodoResult && nodoResult.length > 0 ? nodoResult[0] : {};
        
        // Obtener histórico extendido (últimas 50 lecturas)
        const queryHistorico = `
          SELECT 
            temperatura, humedad, co2, sonido, timestamp,
            DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as fecha_formateada
          FROM lecturas 
          WHERE nodo_id = ?
          ORDER BY timestamp DESC
          LIMIT 50
        `;

        pool.query(queryHistorico, [nodo_target], (errHist, historico) => {
          // Obtener estadísticas generales
          const queryEstadisticas = `
            SELECT 
              COUNT(*) as total_lecturas,
              AVG(temperatura) as temp_promedio,
              MIN(temperatura) as temp_minima,
              MAX(temperatura) as temp_maxima,
              AVG(humedad) as humedad_promedio,
              MIN(humedad) as humedad_minima,
              MAX(humedad) as humedad_maxima,
              AVG(co2) as co2_promedio,
              MIN(co2) as co2_minimo,
              MAX(co2) as co2_maximo,
              AVG(sonido) as sonido_promedio,
              MIN(timestamp) as primera_lectura,
              MAX(timestamp) as ultima_lectura
            FROM lecturas 
            WHERE nodo_id = ?
          `;

          pool.query(queryEstadisticas, [nodo_target], (errEst, estadisticas) => {
            // Obtener lecturas de las últimas 24 horas
            const queryUltimas24h = `
              SELECT 
                temperatura, humedad, co2, sonido, timestamp
              FROM lecturas 
              WHERE nodo_id = ? 
                AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
              ORDER BY timestamp DESC
            `;

            pool.query(queryUltimas24h, [nodo_target], (err24h, ultimas24h) => {
              // Obtener lecturas de la última semana
              const querySemana = `
                SELECT 
                  DATE(timestamp) as fecha,
                  AVG(temperatura) as temp_promedio_dia,
                  AVG(humedad) as humedad_promedio_dia,
                  AVG(co2) as co2_promedio_dia,
                  COUNT(*) as lecturas_del_dia
                FROM lecturas 
                WHERE nodo_id = ? 
                  AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(timestamp)
                ORDER BY fecha DESC
              `;

              pool.query(querySemana, [nodo_target], (errSem, semana) => {
                const contexto = {
                  nodo: {
                    id: nodo_target,
                    tipo_zona: nodo.tipo_zona || 'Zona no especificada',
                    latitud: nodo.latitud || null,
                    longitud: nodo.longitud || null,
                    activo: nodo.activo
                  },
                  lectura_actual: {
                    temperatura: lecturaReciente.temperatura,
                    humedad: lecturaReciente.humedad,
                    co2: lecturaReciente.co2,
                    sonido: lecturaReciente.sonido,
                    timestamp: lecturaReciente.timestamp
                  },
                  estadisticas_generales: estadisticas && estadisticas.length > 0 ? estadisticas[0] : {},
                  historico_reciente: historico || [],
                  ultimas_24_horas: ultimas24h || [],
                  resumen_semanal: semana || [],
                  metadatos: {
                    total_datos_disponibles: {
                      historico_reciente: (historico || []).length,
                      ultimas_24h: (ultimas24h || []).length,
                      resumen_semanal: (semana || []).length
                    },
                    timestamp_consulta: new Date().toISOString()
                  }
                };

                console.log('📊 Contexto completo generado:', {
                  nodo: contexto.nodo.id,
                  lectura_actual: !!contexto.lectura_actual,
                  estadisticas: !!contexto.estadisticas_generales.total_lecturas,
                  historico_count: contexto.historico_reciente.length,
                  ultimas24h_count: contexto.ultimas_24_horas.length,
                  resumen_semanal_count: contexto.resumen_semanal.length
                });

                resolve(contexto);
              });
            });
          });
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
