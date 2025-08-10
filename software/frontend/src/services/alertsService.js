// src/services/alertsService.js
import fetchClient from '@/api/fetchClient';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '@/utils/emailConfig';

// Umbrales para las alertas
export const THRESHOLDS = {
  temperatura: {
    min: 20,
    max: 30,
    unit: '°C'
  },
  humedad: {
    min: 30,
    max: 80,
    unit: '%'
  },
  co2: {
    min: 300,
    max: 1000,
    unit: 'ppm'
  }
};

/**
 * Verifica si un valor está fuera del rango normal
 * @param {number} value - Valor a verificar
 * @param {string} type - Tipo de lectura (temperatura, humedad, co2)
 * @returns {boolean} - true si está fuera de rango, false si no
 */
export const isOutOfRange = (value, type) => {
  const threshold = THRESHOLDS[type];
  return value < threshold.min || value > threshold.max;
};

/**
 * Genera un mensaje de alerta basado en las lecturas
 * @param {Object} readings - Objeto con las lecturas
 * @returns {Array} - Array de mensajes de alerta
 */
export const generateAlertMessage = (readings) => {
  const alertMessages = [];
  
  for (const [key, threshold] of Object.entries(THRESHOLDS)) {
    if (isOutOfRange(readings[key], key)) {
      alertMessages.push(
        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${readings[key]}${threshold.unit} ` +
        `(Rango normal: ${threshold.min}-${threshold.max}${threshold.unit})`
      );
    }
  }
  
  return alertMessages;
};

/**
 * Envía un correo electrónico de alerta
 * @param {Object} readings - Objeto con las lecturas
 * @returns {Promise} - Promesa con el resultado del envío
 */
export const sendAlertEmail = async (readings) => {
  const alertMessages = generateAlertMessage(readings);
  
  if (alertMessages.length === 0) return null;

  const templateParams = {
    email: 'danny24mm11@gmail.com',
    name: 'Danny',
    subject: '¡ALERTA! Valores anormales detectados',
    message: `Se han detectado valores fuera de rango:\n${alertMessages.join('\n')}\nUbicación: ${readings.ubicacion || 'Cañas'}\nFecha: ${readings.fecha || readings.date || new Date().toISOString()}`
  };

  try {
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams
    );
    
    console.log('Alerta enviada con éxito:', response);
    return response;
  } catch (error) {
    console.error('Error al enviar la alerta:', error);
    return error;
  }
};

/**
 * Obtiene el historial de alertas desde la API
 * @returns {Promise} - Promesa con los datos de alertas
 */
export const getAlertHistory = async () => {
  try {
    const response = await fetchClient.get();
    return response;
  } catch (error) {
    console.error('Error al obtener historial de alertas:', error);
    throw error;
  }
};