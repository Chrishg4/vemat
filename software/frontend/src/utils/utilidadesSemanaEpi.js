// src/utils/epiWeekUtils.js

/**
 * Calcula la semana epidemiológica para una fecha dada, siguiendo una lógica similar a ISO 8601.
 * La semana 1 es la primera semana que contiene el primer jueves del año.
 * Las semanas comienzan el lunes.
 *
 * @param {Date} date La fecha para la que se calculará la semana epidemiológica.
 * @returns {number} El número de la semana epidemiológica (1-53).
 */
export const getEpiWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Ajustar a Jueves en la misma semana (para determinar la semana ISO)
  // (d.getUTCDay() + 6) % 7 convierte Domingo(0) a 6, Lunes(1) a 0, etc. para semana que empieza en Lunes.
  // +3 para llegar al Jueves.
  d.setUTCDate(d.getUTCDate() + 3 - (d.getUTCDay() + 6) % 7);

  // Enero 4 siempre está en la semana 1.
  const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 4));
  // Calcular semanas completas hasta el inicio del año (Enero 4)
  const weekNo = Math.ceil(((d - yearStart) / 86400000) / 7) + 1;

  return weekNo;
};

/**
 * Genera una lista completa de las 52 semanas epidemiológicas para un año dado,
 * inicializando los valores de datos a null, siguiendo la lógica ISO 8601.
 * Las semanas comienzan el lunes.
 *
 * @param {number} year El año para el que se generarán las semanas epidemiológicas.
 * @returns {Array<Object>} Una lista de objetos, cada uno representando una semana epidemiológica.
 */
export const getFullEpiWeeksForYear = (year) => {
  const weeks = [];
  // Encontrar el Lunes de la semana que contiene el 4 de Enero del año dado
  const jan4 = new Date(Date.UTC(year, 0, 4));
  let currentWeekStart = new Date(jan4);
  currentWeekStart.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() + 6) % 7); // Ajustar al Lunes de esa semana

  for (let i = 1; i <= 52; i++) { // Asumiendo 52 semanas, algunos años tienen 53
    const weekName = `SE ${i}/${year}`;
    const weekKey = `${year}-EW${String(i).padStart(2, '0')}`;
    weeks.push({
      name: weekName,
      key: weekKey,
      temperatura: null,
      humedad: null,
      co2: null,
      acustica: null,
    });
    currentWeekStart.setUTCDate(currentWeekStart.getUTCDate() + 7); // Avanzar al Lunes de la siguiente semana
  }
  return weeks;
};

/**
 * Agrupa y agrega datos por semana epidemiológica, asegurando que todas las 52 semanas estén presentes.
 * Asume que los datos tienen una propiedad 'fecha' y propiedades numéricas como 'temperatura', 'humedad', 'co2', 'acustica'.
 * Calcula el promedio para cada métrica por semana epidemiológica.
 *
 * @param {Array<Object>} rawData Los datos brutos a agrupar. Cada objeto debe tener una propiedad 'fecha' (string o Date).\n * @returns {Array<Object>} Los datos agregados por semana epidemiológica, incluyendo todas las 52 semanas.
 */
export const aggregateByEpiWeek = (rawData) => {
  const aggregated = {};
  let yearToProcess;

  if (rawData.length > 0) {
    yearToProcess = new Date(rawData[0].fecha).getFullYear();
  } else {
    yearToProcess = new Date().getFullYear(); // Default to current year if no data
  }

  // Primero, agregamos los datos existentes
  rawData.forEach(item => {
    const date = new Date(item.fecha);
    const year = date.getFullYear();
    const epiWeek = getEpiWeek(date);
    const key = `${year}-EW${String(epiWeek).padStart(2, '0')}`;

    // Si el año de la fecha es diferente al año principal, ajustamos el año a procesar
    // Esto es para manejar casos donde la semana 1 del año siguiente empieza en el año anterior
    if (year !== yearToProcess && epiWeek === 1 && date.getMonth() === 11) { // Diciembre
      yearToProcess = year + 1;
    } else if (year !== yearToProcess && epiWeek > 50 && date.getMonth() === 0) { // Enero
      yearToProcess = year - 1;
    }

    if (!aggregated[key]) {
      aggregated[key] = {
        year,
        epiWeek,
        count: 0,
        temperaturaSum: 0,
        humedadSum: 0,
        co2Sum: 0,
        acusticaSum: 0,
      };
    }

    aggregated[key].count++;
    aggregated[key].temperaturaSum += parseFloat(item.temperatura);
    aggregated[key].humedadSum += parseFloat(item.humedad);
    aggregated[key].co2Sum += parseFloat(item.co2);
    aggregated[key].acusticaSum += parseFloat(item.acustica);
  });

  // Generar todas las 52 semanas para el año principal
  const fullEpiWeeks = getFullEpiWeeksForYear(yearToProcess);

  // Fusionar los datos agregados con la lista completa de semanas
  const finalChartData = fullEpiWeeks.map(fullWeek => {
    const existingData = aggregated[fullWeek.key];
    if (existingData) {
      return {
        name: fullWeek.name, // Usamos el nombre de la semana completa para consistencia
        temperatura: existingData.temperaturaSum / existingData.count,
        humedad: existingData.humedadSum / existingData.count,
        co2: existingData.co2Sum / existingData.count,
        acustica: existingData.acusticaSum / existingData.count,
      };
    } else {
      return fullWeek; // Si no hay datos, devolvemos la semana con valores null
    }
  });

  return finalChartData;
};
