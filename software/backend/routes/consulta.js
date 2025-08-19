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
      // Detectar si pide datos específicos
      contexto = await obtenerContextoDatos(nodo_id, prompt);
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
async function obtenerContextoDatos(nodo_id = null, prompt = '') {
  return new Promise((resolve) => {
    console.log('📊 Iniciando obtención de contexto:', { nodo_id, consulta: prompt.substring(0, 30) });
    
    // Detectar consultas específicas
    const promptLower = prompt.toLowerCase();
    
    // Si pide registros específicos de CO2
    if (promptLower.includes('registro') && promptLower.includes('co2')) {
      const numeroMatch = promptLower.match(/\d+/);
      const limite = numeroMatch ? parseInt(numeroMatch[0]) : 10;
      
      console.log('🔍 Consulta específica CO2 detectada, límite:', limite);
      
      const queryEspecificoCO2 = `
        SELECT 
          l.nodo_id, l.co2, l.temperatura, l.humedad, l.timestamp,
          n.nombre as nodo_nombre, n.ubicacion
        FROM lecturas l 
        LEFT JOIN nodos n ON l.nodo_id = n.id
        WHERE l.co2 IS NOT NULL AND l.timestamp IS NOT NULL
        ORDER BY l.timestamp DESC
        LIMIT ?
      `;
      
      pool.query(queryEspecificoCO2, [limite], (err, registrosCO2) => {
        if (err) {
          console.error('❌ Error obteniendo registros específicos de CO2:', err);
          return resolve({ error: 'Error obteniendo datos de CO2' });
        }
        
        console.log('✅ Registros específicos de CO2 obtenidos:', registrosCO2.length);
        return resolve({
          tipo_consulta: 'registros_co2_especificos',
          registros_co2_especificos: registrosCO2,
          total_encontrados: registrosCO2.length,
          limite_solicitado: limite
        });
      });
      
      return;
    }
    
    // Contexto general para otras consultas
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
        
        // Obtener histórico extendido DE TODOS LOS NODOS (SIN LÍMITE para contexto completo)
        const queryHistorico = `
          SELECT 
            nodo_id, temperatura, humedad, co2, sonido, timestamp,
            DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as fecha_formateada
          FROM lecturas 
          WHERE timestamp IS NOT NULL
          ORDER BY timestamp DESC
        `;

        pool.query(queryHistorico, [], (errHist, historico) => {
          console.log('📚 Histórico extendido obtenido:', {
            error: errHist?.message,
            count: historico?.length,
            nodos_incluidos: historico ? [...new Set(historico.map(r => r.nodo_id))] : []
          });
          // Obtener estadísticas generales DE TODOS LOS NODOS
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
              MAX(timestamp) as ultima_lectura,
              COUNT(DISTINCT nodo_id) as total_nodos
            FROM lecturas 
            WHERE timestamp IS NOT NULL
          `;

          pool.query(queryEstadisticas, [], (errEst, estadisticas) => {
            console.log('📊 Estadísticas generales obtenidas:', {
              error: errEst?.message,
              total_lecturas: estadisticas?.[0]?.total_lecturas,
              total_nodos: estadisticas?.[0]?.total_nodos
            });
            // Obtener lecturas de las últimas 24 horas DE TODOS LOS NODOS (SIN LÍMITE)
            const queryUltimas24h = `
              SELECT 
                nodo_id, temperatura, humedad, co2, sonido, timestamp
              FROM lecturas 
              WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                AND timestamp IS NOT NULL
              ORDER BY timestamp DESC
            `;

            pool.query(queryUltimas24h, [], (err24h, ultimas24h) => {
              console.log('⏰ Lecturas últimas 24h obtenidas:', {
                error: err24h?.message,
                count: ultimas24h?.length
              });
              
              // Obtener lecturas de la última semana DE TODOS LOS NODOS
              const querySemana = `
                SELECT 
                  DATE(timestamp) as fecha,
                  nodo_id,
                  AVG(temperatura) as temp_promedio_dia,
                  AVG(humedad) as humedad_promedio_dia,
                  AVG(co2) as co2_promedio_dia,
                  COUNT(*) as lecturas_del_dia,
                  MIN(temperatura) as temp_min_dia,
                  MAX(temperatura) as temp_max_dia,
                  MIN(humedad) as humedad_min_dia,
                  MAX(humedad) as humedad_max_dia
                FROM lecturas 
                WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(timestamp), nodo_id
                ORDER BY fecha DESC, nodo_id
              `;

              pool.query(querySemana, [], (errSem, semana) => {
                console.log('📅 Resumen semanal obtenido:', {
                  error: errSem?.message,
                  count: semana?.length
                });
                
                // Obtener muestra histórica amplia para análisis de tendencias a largo plazo
                const queryHistoricoAmplio = `
                  SELECT 
                    DATE(timestamp) as fecha,
                    nodo_id,
                    AVG(temperatura) as temp_promedio_dia,
                    AVG(humedad) as humedad_promedio_dia,
                    AVG(co2) as co2_promedio_dia,
                    MIN(temperatura) as temp_min_dia,
                    MAX(temperatura) as temp_max_dia,
                    MIN(humedad) as humedad_min_dia,
                    MAX(humedad) as humedad_max_dia,
                    COUNT(*) as lecturas_del_dia
                  FROM lecturas 
                  WHERE timestamp IS NOT NULL
                    AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  GROUP BY DATE(timestamp), nodo_id
                  ORDER BY fecha DESC, nodo_id
                `;

                pool.query(queryHistoricoAmplio, [], (errHist30, historico30) => {
                  console.log('📊 Histórico 30 días obtenido:', {
                    error: errHist30?.message,
                    count: historico30?.length
                  });
                  
                  // Obtener información de todos los nodos para contexto completo
                  const queryTodosNodos = `
                    SELECT 
                      n.id, n.tipo_zona, n.latitud, n.longitud, n.activo,
                      COUNT(l.id) as total_lecturas_nodo,
                      MAX(l.timestamp) as ultima_lectura_nodo,
                      AVG(l.temperatura) as temp_promedio_nodo,
                      AVG(l.humedad) as humedad_promedio_nodo
                    FROM nodos n
                    LEFT JOIN lecturas l ON n.id = l.nodo_id
                    GROUP BY n.id, n.tipo_zona, n.latitud, n.longitud, n.activo
                    ORDER BY n.id
                  `;

                  pool.query(queryTodosNodos, [], (errNodos, todosNodos) => {
                    console.log('🌐 Información de todos los nodos:', {
                      error: errNodos?.message,
                      count: todosNodos?.length
                    });

                    const contexto = {
                    nodo_actual: {
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
                    todos_los_nodos: todosNodos || [],
                    historico_reciente: historico || [],
                    historico_30_dias: historico30 || [],
                    ultimas_24_horas: ultimas24h || [],
                    resumen_semanal: semana || [],
                    metadatos: {
                      total_datos_disponibles: {
                        historico_reciente: (historico || []).length,
                        historico_30_dias: (historico30 || []).length,
                        ultimas_24h: (ultimas24h || []).length,
                        resumen_semanal: (semana || []).length,
                        todos_nodos: (todosNodos || []).length
                      },
                      timestamp_consulta: new Date().toISOString()
                    }
                  };

                  console.log('📊 Contexto completo generado:', {
                    nodo_actual: contexto.nodo_actual.id,
                    lectura_actual: !!contexto.lectura_actual,
                    estadisticas: !!contexto.estadisticas_generales.total_lecturas,
                    historico_count: contexto.historico_reciente.length,
                    historico_30_dias_count: contexto.historico_30_dias.length,
                    ultimas24h_count: contexto.ultimas_24_horas.length,
                    resumen_semanal_count: contexto.resumen_semanal.length,
                    total_nodos: contexto.todos_los_nodos.length
                  });

                  resolve(contexto);
                });
                });
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
