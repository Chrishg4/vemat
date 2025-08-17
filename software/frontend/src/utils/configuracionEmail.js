// src/utils/emailConfig.js
import emailjs from '@emailjs/browser';

// Configuración de EmailJS
export const EMAIL_CONFIG = {
  serviceId: 'service_l2q9dcd',
  templateId: 'template_6npom6e',
  publicKey: '6BJbsgj3nrrqffvyI',
  toEmail: 'danny24mm11@gmail.com'
};

// Inicializar EmailJS con la configuración completa
emailjs.init({
  publicKey: EMAIL_CONFIG.publicKey,
  limitRate: 5 // Limitar a 5 emails por segundo
});
