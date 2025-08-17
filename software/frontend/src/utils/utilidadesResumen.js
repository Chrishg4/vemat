
import { getEpiWeek } from './utilidadesSemanaEpi';

/**
 * Inicializa un objeto de agregación para una semana epidemiológica.
 * @returns {Object} - Un objeto con la estructura para almacenar los resúmenes.
 */
const createInitialAggregator = () => ({
  count: 0,
  temperaturaSum: 0,
  temperaturaMin: Infinity,
  temperaturaMax: -Infinity,
  humedadSum: 0,
  humedadMin: Infinity,
  humedadMax: -Infinity,
  co2Sum: 0,
  co2Min: Infinity,
  co2Max: -Infinity,
  acusticaSum: 0,
  acusticaMin: Infinity,
  acusticaMax: -Infinity,
});

/**
 * Actualiza el agregador con los valores de una nueva lectura.
 * @param {Object} aggregator - El objeto agregador para la semana.
 * @param {Object} item - La lectura individual.
 */
const updateAggregator = (aggregator, item) => {
  const temperatura = parseFloat(item.temperatura);
  const humedad = parseFloat(item.humedad);
  const co2 = parseFloat(item.co2);
  const acustica = parseFloat(item.acustica);

  aggregator.count++;

  // Temperatura
  aggregator.temperaturaSum += temperatura;
  if (temperatura < aggregator.temperaturaMin) aggregator.temperaturaMin = temperatura;
  if (temperatura > aggregator.temperaturaMax) aggregator.temperaturaMax = temperatura;

  // Humedad
  aggregator.humedadSum += humedad;
  if (humedad < aggregator.humedadMin) aggregator.humedadMin = humedad;
  if (humedad > aggregator.humedadMax) aggregator.humedadMax = humedad;

  // CO2
  aggregator.co2Sum += co2;
  if (co2 < aggregator.co2Min) aggregator.co2Min = co2;
  if (co2 > aggregator.co2Max) aggregator.co2Max = co2;

  // Acustica
  aggregator.acusticaSum += acustica;
  if (acustica < aggregator.acusticaMin) aggregator.acusticaMin = acustica;
  if (acustica > aggregator.acusticaMax) aggregator.acusticaMax = acustica;
};

/**
 * Finaliza el cálculo del resumen, calculando promedios.
 * @param {Object} aggregator - El objeto agregador.
 * @returns {Object} - El objeto con los resúmenes finales (avg, min, max).
 */
const finalizeSummary = (aggregator) => {
  if (aggregator.count === 0) {
    return {
      temperatura: { avg: null, min: null, max: null },
      humedad: { avg: null, min: null, max: null },
      co2: { avg: null, min: null, max: null },
      acustica: { avg: null, min: null, max: null },
    };
  }

  return {
    temperatura: {
      avg: aggregator.temperaturaSum / aggregator.count,
      min: aggregator.temperaturaMin,
      max: aggregator.temperaturaMax,
    },
    humedad: {
      avg: aggregator.humedadSum / aggregator.count,
      min: aggregator.humedadMin,
      max: aggregator.humedadMax,
    },
    co2: {
      avg: aggregator.co2Sum / aggregator.count,
      min: aggregator.co2Min,
      max: aggregator.co2Max,
    },
    acustica: {
      avg: aggregator.acusticaSum / aggregator.count,
      min: aggregator.acusticaMin,
      max: aggregator.acusticaMax,
    },
  };
};

/**
 * Agrupa y resume los datos por semana epidemiológica, calculando promedio, mínimo y máximo.
 * @param {Array<Object>} rawData - Los datos brutos a agrupar.
 * @returns {Array<Object>} - Datos resumidos por semana epidemiológica.
 */
export const resumirPorSemanaEpi = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return [];
  }

  // Ordenar los datos por fecha descendente para asegurar que procesamos los más recientes primero
  const sortedData = [...rawData].sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  const aggregated = {};

  rawData.forEach(item => {
    const date = new Date(item.fecha);
    const year = date.getFullYear();
    const epiWeek = getEpiWeek(date);
    const key = `${year}-EW${String(epiWeek).padStart(2, '0')}`;

    if (!aggregated[key]) {
      aggregated[key] = createInitialAggregator();
      aggregated[key].year = year;
      aggregated[key].epiWeek = epiWeek;
    }

    updateAggregator(aggregated[key], item);
  });

  const result = Object.keys(aggregated).map(key => {
    const summary = finalizeSummary(aggregated[key]);
    return {
      key,
      year: aggregated[key].year,
      epiWeek: aggregated[key].epiWeek,
      name: `SE ${aggregated[key].epiWeek}/${aggregated[key].year}`,
      ...summary,
    };
  });

  // Ordenar por año y semana epidemiológica
  return result.sort((a, b) => a.key.localeCompare(b.key));
};
