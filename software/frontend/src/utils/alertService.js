// src/utils/alertService.js
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './emailConfig';

// Umbrales para las alertas
const THRESHOLDS = {
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

// Función para verificar si un valor está fuera de rango
const isOutOfRange = (value, type) => {
  const threshold = THRESHOLDS[type];
  return value < threshold.min || value > threshold.max;
};

// Función para generar el mensaje de alerta
const generateAlertMessage = (readings) => {
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

// Función para enviar el correo de alerta
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

// Función para verificar y enviar alertas si es necesario
export const checkAndSendAlerts = async (readings, setAlertHistory) => {
  const alertsToSend = ['temperatura', 'humedad', 'co2']
    .filter(type => isOutOfRange(readings[type], type))
    .map(type => ({
      fecha: readings.fecha || readings.date || new Date().toISOString(),
      tipo: type,
      valor: readings[type],
      rangoNormal: `${THRESHOLDS[type].min}-${THRESHOLDS[type].max}${THRESHOLDS[type].unit}`,
      estado: 'pendiente'
    }));

  if (alertsToSend.length > 0) {
    try {
      await sendAlertEmail(readings);
      
      // Actualizar el estado de las alertas a 'enviado'
      const alertasConEstado = alertsToSend.map(alerta => ({
        ...alerta,
        estado: 'enviado'
      }));

      // Actualizar el historial de alertas
      setAlertHistory(prev => [...alertasConEstado, ...prev]);
    } catch (error) {
      const alertasConError = alertsToSend.map(alerta => ({
        ...alerta,
        estado: 'error'
      }));
      setAlertHistory(prev => [...alertasConError, ...prev]);
    }
  }
};
