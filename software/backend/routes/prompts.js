const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/prompts:
 *   get:
 *     summary: Obtener prompts predefinidos sugeridos
 *     tags: [Vistas]
 *     responses:
 *       200:
 *         description: Lista de prompts sugeridos organizados por categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 prompts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       titulo:
 *                         type: string
 *                       prompt:
 *                         type: string
 *                       categoria:
 *                         type: string
 */
router.get('/', (req, res) => {
  try {
    const promptsSugeridos = [
      {
        id: 'riesgo-actual',
        titulo: '🦟 Evaluación de Riesgo Entomológico',
        prompt: 'Evalúa cuantitativamente el índice de riesgo entomológico actual considerando los parámetros microclimáticos y su correlación con el ciclo de vida del Aedes aegypti.',
        categoria: 'Análisis'
      },
      {
        id: 'tendencias',
        titulo: '📈 Modelado Predictivo',
        prompt: 'Desarrolla un modelo predictivo de 24-48 horas para la evolución de las condiciones ambientales y su impacto en la densidad larvaria proyectada.',
        categoria: 'Predicción'
      },
      {
        id: 'recomendaciones',
        titulo: '💡 Estrategias de Control Vectorial',
        prompt: 'Formula un protocolo técnico de control vectorial integrado basado en las condiciones microclimáticas actuales, incluyendo métodos físicos, biológicos y químicos apropiados.',
        categoria: 'Recomendaciones'
      },
      {
        id: 'condiciones-optimas',
        titulo: '🌡️ Análisis Termodinámico',
        prompt: 'Analiza la relación termodinámica entre temperatura, humedad relativa y presión de vapor para determinar el potencial reproductivo vectorial en las próximas 72 horas.',
        categoria: 'Evaluación'
      },
      {
        id: 'analisis-vectorial',
        titulo: '🔬 Análisis Vectorial',
        prompt: 'Realiza un análisis técnico sobre la dinámica poblacional de vectores basándote en las variables ambientales actuales y su impacto en la capacidad reproductiva.',
        categoria: 'Análisis'
      },
      {
        id: 'comparacion-historica',
        titulo: '📊 Análisis Comparativo Temporal',
        prompt: 'Realiza un análisis estadístico comparativo de las variables microclimáticas actuales versus el mismo período de años anteriores, identificando desviaciones significativas.',
        categoria: 'Histórico'
      },
      {
        id: 'impacto-sonido',
        titulo: '🔊 Análisis Bioacústico',
        prompt: 'Interpreta los patrones bioacústicos detectados en relación con la actividad vectorial nocturna y diurna, correlacionando con variables ambientales.',
        categoria: 'Análisis'
      },
      {
        id: 'co2-correlacion',
        titulo: '💨 Análisis de CO2 y Metabolismo Vectorial',
        prompt: 'Examina la correlación entre concentraciones de CO2 ambiental y la actividad metabólica vectorial, considerando su impacto en comportamiento de búsqueda de hospedador.',
        categoria: 'Correlación'
      }
    ];

    // Organizar por categorías
    const categorias = {};
    promptsSugeridos.forEach(prompt => {
      if (!categorias[prompt.categoria]) {
        categorias[prompt.categoria] = [];
      }
      categorias[prompt.categoria].push(prompt);
    });

    res.json({
      success: true,
      prompts: promptsSugeridos,
      por_categoria: categorias,
      total: promptsSugeridos.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(' Error obteniendo prompts sugeridos:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo prompts sugeridos'
    });
  }
});

module.exports = router;
