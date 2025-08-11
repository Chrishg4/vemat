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
 * Agrupa y agrega datos por semana epidemiológica.
 * Asume que los datos tienen una propiedad 'fecha' y propiedades numéricas como 'temperatura', 'humedad', 'co2', 'sonido'.
 * Calcula el promedio para cada métrica por semana epidemiológica.
 *
 * @param {Array<Object>} rawData Los datos brutos a agrupar. Cada objeto debe tener una propiedad 'fecha' (string o Date).
 * @returns {Array<Object>} Los datos agregados por semana epidemiológica.
 */
export const aggregateByEpiWeek = (rawData) => {
  const aggregated = {};

  rawData.forEach(item => {
    const date = new Date(item.fecha);
    const year = date.getFullYear();
    const epiWeek = getEpiWeek(date);
    const key = `${year}-EW${epiWeek < 10 ? '0' + epiWeek : epiWeek}`;

    if (!aggregated[key]) {
      aggregated[key] = {
        year,
        epiWeek,
        count: 0,
        temperaturaSum: 0,
        humedadSum: 0,
        co2Sum: 0,
        sonidoSum: 0,
      };
    }

    aggregated[key].count++;
    aggregated[key].temperaturaSum += parseFloat(item.temperatura);
    aggregated[key].humedadSum += parseFloat(item.humedad);
    aggregated[key].co2Sum += parseFloat(item.co2);
    aggregated[key].sonidoSum += parseFloat(item.sonido);
  });

  return Object.keys(aggregated).sort().map(key => {
    const data = aggregated[key];
    return {
      name: key, // e.g., "2023-EW01"
      temperatura: data.temperaturaSum / data.count,
      humedad: data.humedadSum / data.count,
      co2: data.co2Sum / data.count,
      sonido: data.sonidoSum / data.count,
    };
  });
};
