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
  limitRate: 2, // Reducir a 2 emails por segundo para evitar errores 426
  // Opciones adicionales para manejar errores de conexión
  retryTimes: 3, // Intentar hasta 3 veces si falla
  retryDelay: 2000 // Esperar 2 segundos entre reintentos
});
