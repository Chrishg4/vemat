const express = require('express');
const router = express.Router();
const VEMATAssistant = require('../services/vematAssistant');

// Inicializar asistente IA
const assistant = new VEMATAssistant();

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Verificar estado del asistente IA
 *     tags: [Vistas]
 *     responses:
 *       200:
 *         description: Estado del servicio IA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 disponible:
 *                   type: boolean
 *                 modo:
 *                   type: string
 *                   example: "demo"
 *                 version:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
router.get('/', (req, res) => {
  try {
    const status = assistant.getEstadoOperacional();
    res.json({
      success: true,
      ...status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error obteniendo status IA:', error);
    res.status(500).json({
      success: false,
      error: 'Error verificando estado del asistente',
      disponible: false
    });
  }
});

module.exports = router;
