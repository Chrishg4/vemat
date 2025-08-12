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
  const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 1)); // 1 de enero del año actual

  // Encontrar el primer domingo del año
  let firstSunday = new Date(yearStart);
  while (firstSunday.getUTCDay() !== 0) { // 0 = Domingo
    firstSunday.setUTCDate(firstSunday.getUTCDate() + 1);
  }

  // Si la fecha es anterior al primer domingo del año, pertenece a la última semana del año anterior
  if (d < firstSunday) {
    const prevYearLastDay = new Date(Date.UTC(d.getFullYear() - 1, 11, 31));
    return getEpiWeek(prevYearLastDay); // Recursivamente obtener la semana del año anterior
  }

  // Calcular la diferencia en días desde el primer domingo del año
  const diffDays = Math.floor((d - firstSunday) / (1000 * 60 * 60 * 24));

  // La semana epidemiológica es (días desde el primer domingo / 7) + 1
  return Math.floor(diffDays / 7) + 1;
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
  // Para 2025, el 1 de enero es miércoles. El domingo más cercano es el 29 de diciembre de 2024.
  // Asumimos que la semana 1 de un año comienza el domingo más cercano al 1 de enero de ese año.
  // Esto puede variar ligeramente según la definición exacta de la semana epidemiológica.
  // Aquí, para 2025, la semana 1 comienza el 29 de diciembre de 2024.
  let currentWeekStart = new Date(`${year - 1}-12-29T00:00:00`); 

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
    currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Avanzar a la siguiente semana
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
  let yearToProcess = 2025; // Asumimos 2025 como el año principal a procesar

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
