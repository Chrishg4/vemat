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
        titulo: '🦟 Evaluar Riesgo Actual',
        prompt: '¿Cuál es el nivel de riesgo actual de proliferación de mosquitos según las condiciones ambientales?',
        categoria: 'Análisis'
      },
      {
        id: 'tendencias',
        titulo: '📈 Analizar Tendencias',
        prompt: 'Analiza las tendencias de los últimos datos y predice cómo evolucionarán las condiciones en las próximas 24 horas.',
        categoria: 'Predicción'
      },
      {
        id: 'recomendaciones',
        titulo: '💡 Obtener Recomendaciones',
        prompt: 'Basándote en las condiciones actuales, ¿qué medidas de control vectorial recomendarías implementar?',
        categoria: 'Recomendaciones'
      },
      {
        id: 'condiciones-optimas',
        titulo: '🌡️ Condiciones Óptimas',
        prompt: '¿Las condiciones actuales de temperatura y humedad favorecen la reproducción de mosquitos Aedes aegypti?',
        categoria: 'Evaluación'
      },
      {
        id: 'alerta-temprana',
        titulo: '⚠️ Sistema de Alerta',
        prompt: '¿Debería activarse alguna alerta epidemiológica basándose en los parámetros actuales?',
        categoria: 'Alertas'
      },
      {
        id: 'comparacion-historica',
        titulo: '📊 Comparación Histórica',
        prompt: '¿Cómo se comparan las condiciones actuales con el mismo período del año pasado?',
        categoria: 'Histórico'
      },
      {
        id: 'impacto-sonido',
        titulo: '🔊 Análisis Acústico',
        prompt: '¿Qué información epidemiológica puede extraerse de los niveles de sonido detectados?',
        categoria: 'Análisis'
      },
      {
        id: 'co2-correlacion',
        titulo: '💨 Análisis CO2',
        prompt: '¿Existe alguna correlación entre los niveles de CO2 y la actividad vectorial en esta zona?',
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
    console.error('❌ Error obteniendo prompts sugeridos:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo prompts sugeridos'
    });
  }
});

module.exports = router;
