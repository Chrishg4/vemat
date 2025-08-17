// software/frontend/src/utils/utilidadesValidacion.js

/**
 * Valida las lecturas para generar alertas basado en una ventana deslizante y múltiples criterios.
 * @param {Array<object>} lecturas - El array de lecturas a validar.
 * @param {Array<object>} criterios - Un array de criterios para la validación.
 * @returns {Array<Array<object>>} Un array de grupos de 9 lecturas que cumplen con todos los criterios.
 */
export function validarLecturasParaAlerta(lecturas, criterios) {
  if (!lecturas || !Array.isArray(lecturas) || !Array.isArray(criterios)) {
    return [];
  }

  const alertas = [];
  let i = 0;
  while (i <= lecturas.length - 9) {
    const ventana = lecturas.slice(i, i + 9);

    const todasLasLecturasEnVentanaCumplen = ventana.every(lectura => {
      // Cada lectura debe cumplir con todos los criterios
      return criterios.every(criterio => {
        const { campo, operador, umbral, umbralMax } = criterio;
        const valor = lectura[campo];
        if (valor === undefined) return false;

        switch (operador) {
          case '>':
            return valor > umbral;
          case '<':
            return valor < umbral;
          case '>=':
            return valor >= umbral;
          case '<=':
            return valor <= umbral;
          case '==':
            return valor == umbral;
          case 'entre':
            return valor >= umbral && valor <= umbralMax;
          default:
            return false;
        }
      });
    });

    if (todasLasLecturasEnVentanaCumplen) {
      alertas.push(ventana);
      i += 9; // Saltar las 9 lecturas que ya generaron una alerta
    } else {
      i++; // Mover la ventana una posición
    }
  }

  return alertas;
}
