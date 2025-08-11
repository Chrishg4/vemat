/**
 * Obtiene el año y la semana epidemiológica para una fecha dada.
 *
 * @param {Date | string} date - La fecha para la cual calcular la semana epidemiológica. Puede ser un objeto Date o un string que pueda ser interpretado por el constructor de Date.
 * @returns {{year: number, week: number}} Un objeto que contiene el año y el número de la semana epidemiológica.
 */
export function getEpiWeek(date) {
  // Crear una copia de la fecha para no modificar el objeto original.
  const d = new Date(Date.UTC(
    new Date(date).getFullYear(),
    new Date(date).getMonth(),
    new Date(date).getDate()
  ));

  // El día de la semana (0=domingo, 1=lunes, ..., 6=sábado)
  const dayNum = d.getUTCDay();

  // Mover la fecha al jueves de esa semana.
  // El estándar se basa en el jueves para determinar a qué año pertenece la semana.
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  // Obtener el primer día del año.
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  // Calcular el número de la semana.
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

  return {
    year: d.getUTCFullYear(),
    week: weekNo
  };
}