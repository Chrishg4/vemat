// src/utils/generarDatos.js
const CANAS_LATITUDE = 10.43079;
const CANAS_LONGITUDE = -85.08499;
const CANAS_CITY = "Cañas"; // Asegúrate de que esto sea "Cañas"

export function generarDatos() {
  const currentTime = new Date();
  const fecha = currentTime.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const hora = currentTime.toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const dateTime = `${fecha}, ${hora}`;

  // Variable estática para controlar el tiempo entre alertas
  if (!generarDatos.lastAlertTime) {
    generarDatos.lastAlertTime = new Date(0);
  }

  // Verificar si han pasado 20 minutos desde la última alerta
  const timeElapsed = currentTime - generarDatos.lastAlertTime;
  const twentyMinutesInMs = 20 * 60 * 1000;
  
  // Decidir si generamos valores anormales basado en el tiempo transcurrido
  const shouldGenerateAlert = timeElapsed >= twentyMinutesInMs && Math.random() < 0.5;

  if (shouldGenerateAlert) {
    generarDatos.lastAlertTime = currentTime;
  }

  // Generamos valores aleatorios
  const temperatura = shouldGenerateAlert ? 
    Number((35 + Math.random() * 5).toFixed(1)) : // Temperatura alta (35-40°C)
    Number((20 + Math.random() * 10).toFixed(1)); // Temperatura normal (20-30°C)

  const humedad = shouldGenerateAlert ? 
    Number((85 + Math.random() * 10).toFixed(1)) : // Humedad alta (85-95%)
    Number((50 + Math.random() * 30).toFixed(1)); // Humedad normal (50-80%)

  const co2 = shouldGenerateAlert ? 
    Number((1100 + Math.random() * 400).toFixed(0)) : // CO2 alto (1100-1500 ppm)
    Number((300 + Math.random() * 200).toFixed(0)); // CO2 normal (300-500 ppm)

  return {
    date: dateTime,
    temperatura,
    humedad,
    co2,
    city: CANAS_CITY,
    latitude: CANAS_LATITUDE,
    longitude: CANAS_LONGITUDE,
  };
}
