// src/utils/generarDatos.js
const CANAS_LATITUDE = 10.43079;
const CANAS_LONGITUDE = -85.08499;
const CANAS_CITY = "Cañas"; // Asegúrate de que esto sea "Cañas"

export function generarDatos() {
  const now = new Date();
  const fecha = now.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const hora = now.toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const dateTime = `${fecha}, ${hora}`;

  // Generamos valores aleatorios que pueden estar fuera de rango
  const temperatura = Math.random() < 0.3 ? // 30% de probabilidad de valor anormal
    Number((35 + Math.random() * 5).toFixed(1)) : // Temperatura alta (35-40°C)
    Number((20 + Math.random() * 10).toFixed(1)); // Temperatura normal (20-30°C)

  const humedad = Math.random() < 0.3 ? // 30% de probabilidad de valor anormal
    Number((85 + Math.random() * 10).toFixed(1)) : // Humedad alta (85-95%)
    Number((50 + Math.random() * 30).toFixed(1)); // Humedad normal (50-80%)

  const co2 = Math.random() < 0.3 ? // 30% de probabilidad de valor anormal
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
