const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const connection = require('../db/connection');

// Configuración de Nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'vemat.system@gmail.com', // Configurar en variables de entorno
    pass: process.env.EMAIL_PASS || 'your-app-password'        // App password de Gmail
  },
  tls: {
    rejectUnauthorized: false // Permitir certificados autofirmados
  }
});

// Umbrales para condiciones favorables a mosquitos (basados en el frontend)
const FAVORABLE_THRESHOLDS = {
  temperatura: { min: 26, max: 30 },
  humedad: { min: 65, max: Infinity },
  co2: { min: 50, max: 200 }
};

// Control de frecuencia de alertas (evitar spam)
let lastAlertSent = 0;
const ALERT_COOLDOWN = 10 * 60 * 1000; // 10 minutos para demostración

/**
 * Verifica si las condiciones son favorables para mosquitos
 */
function isFavorableCondition(value, type) {
  const threshold = FAVORABLE_THRESHOLDS[type];
  return value >= threshold.min && value <= threshold.max;
}

/**
 * Obtiene las últimas 9 lecturas de la base de datos
 */
async function getLatestReadings() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT temperatura, humedad, co2, timestamp, nodo_id 
      FROM lecturas 
      ORDER BY timestamp DESC 
      LIMIT 9
    `;
    
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Analiza las últimas 9 lecturas y determina si enviar alerta
 */
async function analyzeAndAlert() {
  try {
    console.log('🔍 Analizando condiciones para alertas automáticas...');
    
    const readings = await getLatestReadings();
    
    if (readings.length < 9) {
      console.log('⚠️ Insuficientes lecturas para análisis (menos de 9)');
      return { success: false, message: 'Insuficientes lecturas' };
    }

    // Verificar si todas las últimas 9 lecturas cumplen condiciones favorables
    const allFavorable = readings.every(reading => {
      return isFavorableCondition(reading.temperatura, 'temperatura') &&
             isFavorableCondition(reading.humedad, 'humedad') &&
             isFavorableCondition(reading.co2, 'co2');
    });

    if (!allFavorable) {
      console.log('✅ Condiciones normales - No se requiere alerta');
      return { success: false, message: 'Condiciones normales' };
    }

    // Verificar cooldown para evitar spam
    const now = Date.now();
    if (now - lastAlertSent < ALERT_COOLDOWN) {
      const remaining = Math.ceil((ALERT_COOLDOWN - (now - lastAlertSent)) / 60000);
      console.log(`⏳ Alerta en cooldown. Faltan ${remaining} minutos`);
      return { success: false, message: `Cooldown activo: ${remaining}min restantes` };
    }

    // Calcular promedios
    const avgTemp = readings.reduce((sum, r) => sum + r.temperatura, 0) / 9;
    const avgHum = readings.reduce((sum, r) => sum + r.humedad, 0) / 9;
    const avgCo2 = readings.reduce((sum, r) => sum + r.co2, 0) / 9;

    // Enviar alerta por correo
    const alertResult = await sendEmailAlert({
      avgTemp: avgTemp.toFixed(1),
      avgHum: avgHum.toFixed(1),
      avgCo2: avgCo2.toFixed(1),
      lastReading: readings[0].timestamp,
      nodoId: readings[0].nodo_id
    });

    if (alertResult.success) {
      lastAlertSent = now;
      console.log('📧 Alerta enviada exitosamente');
      
      // Registrar la alerta en base de datos
      await logAlert(readings[0].nodo_id, 'Condicion_Critica', `Temp: ${avgTemp.toFixed(1)}°C, Hum: ${avgHum.toFixed(1)}%, CO2: ${avgCo2.toFixed(1)}ppm`);
    }

    return alertResult;

  } catch (error) {
    console.error('❌ Error en análisis de alertas:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía alerta por correo electrónico
 */
async function sendEmailAlert(data) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'vemat.system@gmail.com',
      to: [
        'chrishg2004@gmail.com',
        'danny24mm11@gmail.com', 
        'jorodriguezce@est.utn.ac.cr',
        'rodriguezgonzalezjefferson@gmail.com'
      ].join(','),
      subject: '🚨 VEMAT ALERTA: Condiciones Favorables para Mosquitos Detectadas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f; text-align: center;">🦟 ALERTA VEMAT - CONDICIONES FAVORABLES</h2>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Condiciones Propicias para Proliferación de Mosquitos</h3>
            <p>Se han detectado condiciones ambientales favorables para la proliferación de mosquitos en las <strong>últimas 9 lecturas consecutivas</strong>.</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #495057;">📊 Promedios de las Últimas 9 Lecturas:</h4>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 10px 0; padding: 8px; background: white; border-radius: 4px;">
                🌡️ <strong>Temperatura:</strong> ${data.avgTemp}°C (Rango favorable: 26-30°C)
              </li>
              <li style="margin: 10px 0; padding: 8px; background: white; border-radius: 4px;">
                💧 <strong>Humedad:</strong> ${data.avgHum}% (Rango favorable: >65%)
              </li>
              <li style="margin: 10px 0; padding: 8px; background: white; border-radius: 4px;">
                🌬️ <strong>CO2:</strong> ${data.avgCo2} ppm (Rango favorable: 50-200ppm)
              </li>
            </ul>
          </div>

          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #0c5aa6;">📍 Información del Sitio:</h4>
            <p><strong>Nodo:</strong> ${data.nodoId}</p>
            <p><strong>Última lectura:</strong> ${new Date(data.lastReading).toLocaleString('es-CR')}</p>
            <p><strong>Ubicación:</strong> Cañas, Guanacaste</p>
          </div>

          <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #c62828;">🏥 Recomendaciones:</h4>
            <ul>
              <li>Inspeccionar áreas de alcantarillado cercanas</li>
              <li>Intensificar medidas de control vectorial</li>
              <li>Informar a autoridades de salud locales</li>
              <li>Monitorear evolución en dashboard: <a href="https://vemat-frontend.onrender.com">VEMAT Dashboard</a></li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
            <p>Sistema VEMAT - Vigilancia Ecológica de Mosquitos con Asistencia Tecnológica</p>
            <p>Este es un mensaje automático del sistema de monitoreo ambiental</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email enviado:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Registra la alerta en base de datos para historial
 */
async function logAlert(nodoId, tipo, detalles) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO alertas (nodo_id, tipo, detalles, fecha_envio) 
      VALUES (?, ?, ?, NOW())
    `;
    
    connection.query(query, [nodoId, tipo, detalles], (error, results) => {
      if (error) {
        console.error('❌ Error registrando alerta:', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Rutas del API

/**
 * POST /api/alertas/check - Verificar condiciones manualmente
 */
router.post('/check', async (req, res) => {
  try {
    const result = await analyzeAndAlert();
    res.json({
      success: true,
      alertSent: result.success,
      message: result.message || 'Análisis completado',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/alertas/status - Estado del sistema de alertas
 */
router.get('/status', (req, res) => {
  const timeSinceLastAlert = Date.now() - lastAlertSent;
  const cooldownRemaining = Math.max(0, ALERT_COOLDOWN - timeSinceLastAlert);
  
  res.json({
    active: true,
    lastAlertSent: lastAlertSent > 0 ? new Date(lastAlertSent).toISOString() : null,
    cooldownRemaining: Math.ceil(cooldownRemaining / 60000), // minutos
    thresholds: FAVORABLE_THRESHOLDS,
    emailConfig: {
      service: 'gmail',
      user: process.env.EMAIL_USER || 'Not configured'
    }
  });
});

/**
 * GET /api/alertas/history - Historial de alertas enviadas
 */
router.get('/history', (req, res) => {
  const query = `
    SELECT * FROM alertas 
    ORDER BY fecha_envio DESC 
    LIMIT 50
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({
        success: true,
        alerts: results,
        total: results.length
      });
    }
  });
});

// ========================================
// SISTEMA DE ALERTAS AUTOMÁTICAS
// ========================================

// OPCIÓN 1: SISTEMA CADA 5 MINUTOS (para demostración)
// Descomentar estas líneas para activar sistema continuo cada 5 minutos
/*
setInterval(async () => {
  console.log('🔄 Ejecutando análisis automático de alertas...');
  await analyzeAndAlert();
}, 5 * 60 * 1000); // 5 minutos

console.log('📧 Sistema de alertas cada 5 minutos ACTIVADO');
console.log('📧 Cooldown entre alertas: 10 minutos');
*/

// OPCIÓN 2: SISTEMA PROGRAMADO DIARIO A LAS 8:00 AM (ACTIVO)
// Comentar estas líneas para desactivar sistema diario
cron.schedule('0 8 * * *', async () => {
  console.log('🕐 Ejecutando análisis programado diario (8:00 AM)...');
  await analyzeAndAlert();
}, {
  scheduled: true,
  timezone: "America/Costa_Rica"
});

console.log('📧 Sistema de alertas automáticas inicializado');
console.log('📧 Sistema programado: Diario a las 8:00 AM (Costa Rica)');
console.log('📧 Destinatarios: 4 correos configurados');
console.log('📧 Cooldown entre alertas: 10 minutos');

module.exports = router;
