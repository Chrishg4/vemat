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

export const FAVORABLE_THRESHOLDS = {
  temperatura: {
    min: 26,
    max: 30,
    unit: '°C'
  },
  humedad: {
    min: 65,
    max: Infinity, // >65%
    unit: '%'
  },
  co2: {
    min: 50,
    max: 200,
    unit: 'ppm'
  }
};

/**
 * Verifica si un valor está dentro del rango de condiciones favorables
 * @param {number} value - Valor a verificar
 * @param {string} type - Tipo de lectura (temperatura, humedad, co2)
 * @returns {boolean} - true si está dentro del rango favorable, false si no
 */
export const isFavorableCondition = (value, type) => {
  const threshold = FAVORABLE_THRESHOLDS[type];
  return value >= threshold.min && value <= threshold.max;
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


export const checkAndGenerateFavorableConditionsAlert = (allReadings) => {
  if (!allReadings || allReadings.length < 9) {
    return null; // No hay suficientes lecturas para verificar
  }

  // Ordenar las lecturas por fecha de forma descendente y tomar las últimas 9
  const latestReadings = [...allReadings].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 9);

  // Verificar si todas las últimas 9 lecturas cumplen las condiciones favorables
  const allFavorable = latestReadings.every(reading => {
    return isFavorableCondition(reading.temperatura, 'temperatura') &&
           isFavorableCondition(reading.humedad, 'humedad') &&
           isFavorableCondition(reading.co2, 'co2');
  });

  if (allFavorable) {
    // Calcular promedios
    const avgTemp = latestReadings.reduce((sum, r) => sum + r.temperatura, 0) / 9;
    const avgHum = latestReadings.reduce((sum, r) => sum + r.humedad, 0) / 9;
    const avgCo2 = latestReadings.reduce((sum, r) => sum + r.co2, 0) / 9;

    const lastReadingTime = new Date(latestReadings[0].fecha);
    const date = lastReadingTime.toLocaleDateString();
    const time = lastReadingTime.toLocaleTimeString();

    return `Condiciones favorables para proliferación de mosquitos detectadas. ` +
           `Fecha: ${date}, Hora: ${time}. ` +
           `Promedios (últimas 9 mediciones): Temp: ${avgTemp.toFixed(1)}°C, Hum: ${avgHum.toFixed(1)}%, CO2: ${avgCo2.toFixed(1)}ppm.`;
  }

  return null;
};

/**
 * Genera un mensaje de alerta basado en las lecturas
 * @param {Object} readings - Objeto con las lecturas
 * @param {Array} allReadings - Array de todas las lecturas disponibles (para alertas de condiciones favorables)
 * @returns {Array} - Array de mensajes de alerta
 */
export const generateAlertMessage = (readings, allReadings) => {
  const alertMessages = [];
  
  for (const [key, threshold] of Object.entries(THRESHOLDS)) {
    if (isOutOfRange(readings[key], key)) {
      alertMessages.push(
        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${readings[key]}${threshold.unit} ` +
        `(Rango normal: ${threshold.min}-${threshold.max}${threshold.unit})`
      );
    }
  }

  // Verificar y añadir la alerta de condiciones favorables
  const favorableAlert = checkAndGenerateFavorableConditionsAlert(allReadings);
  if (favorableAlert) {
    alertMessages.push(favorableAlert);
  }
  
  return alertMessages;
};

/**
 * Envía un correo electrónico de alerta
 * @param {Object} readings - Objeto con las lecturas
 * @returns {Promise} - Promesa con el resultado del envío
 */
export const sendAlertEmail = async (readings, allReadings) => {
  const alertMessages = generateAlertMessage(readings, allReadings);
  
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