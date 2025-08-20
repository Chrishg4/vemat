// src/utils/testEmail.js
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './emailConfig';

export const sendTestEmail = async () => {
  const templateParams = {
    email: 'danny24mm11@gmail.com',
    name: 'Danny',
    subject: 'Prueba de Sistema VEMAT',
    message: 'Este es un correo de prueba del sistema VEMAT'
  };

  try {
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams);
    return response;
  } catch (error) {
    console.error('Error al enviar correo de prueba:', error);
    return error;
  }
};
