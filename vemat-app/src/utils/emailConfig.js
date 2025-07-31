// src/utils/emailConfig.js
import emailjs from '@emailjs/browser';

// Configuración de EmailJS
export const EMAIL_CONFIG = {
  serviceId: 'service_9k73vok',
  templateId: 'template_vadxexa',
  publicKey: '5ieb0GaodcFZUZCYB',
  toEmail: 'danny24mm11@gmail.com'
};

// Inicializar EmailJS con la configuración completa
emailjs.init({
  publicKey: EMAIL_CONFIG.publicKey,
  limitRate: 5 // Limitar a 5 emails por segundo
});
