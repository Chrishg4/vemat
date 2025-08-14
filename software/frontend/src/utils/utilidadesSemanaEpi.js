// src/utils/epiWeekUtils.js

/**
 * Calcula la semana epidemiológica para una fecha dada.
 * La semana epidemiológica 1 comienza el primer domingo del año.
 * Si el 1 de enero es domingo, esa es la semana 1.
 * Si el 1 de enero no es domingo, la semana 1 comienza el primer domingo después del 1 de enero.
 * Los días antes del primer domingo del año pertenecen a la última semana epidemiológica del año anterior.
 *
 * @param {Date} date La fecha para la que se calculará la semana epidemiológica.
 * @returns {number} El número de la semana epidemiológica (1-53).
 */
export const getEpiWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 1));

  let firstSunday = new Date(yearStart);
  while (firstSunday.getUTCDay() !== 0) {
    firstSunday.setUTCDate(firstSunday.getUTCDate() + 1);
  }

  if (d < firstSunday) {
    // Si la fecha es anterior al primer domingo del año, pertenece a la última semana del año anterior.
    // Calculamos la semana epidemiológica para el último día del año anterior.
    const prevYearLastDay = new Date(Date.UTC(d.getFullYear() - 1, 11, 31));
    return getEpiWeek(prevYearLastDay); // Debería devolver solo el número de semana
  }

  const diffDays = Math.floor((d - firstSunday) / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  return week;
};

/**
 * Genera una lista completa de las 52 semanas epidemiológicas para un año dado,
 * inicializando los valores de datos a null.
 *
 * @param {number} year El año para el que se generarán las semanas epidemiológicas.
 * @returns {Array<Object>} Una lista de objetos, cada uno representando una semana epidemiológica.
 */
export const getFullEpiWeeksForYear = (year) => {
  const weeks = [];
  const yearStart = new Date(Date.UTC(year, 0, 1)); // Enero 1 del año dado

  let firstSunday = new Date(yearStart);
  // Encuentra el primer domingo del año
  while (firstSunday.getUTCDay() !== 0) {
    firstSunday.setUTCDate(firstSunday.getUTCDate() + 1);
  }

  let currentWeekStart = new Date(firstSunday); // La semana 1 comienza en el primer domingo

  for (let i = 1; i <= 52; i++) {
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
    currentWeekStart.setUTCDate(currentWeekStart.getUTCDate() + 7); // Avanzar a la siguiente semana
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
