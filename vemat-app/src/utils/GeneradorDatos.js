// utils/generarDatos.js

export function generarDatos() {
  return {
    temperatura: Number((20 + Math.random() * 10).toFixed(1)),
    humedad: Number((50 + Math.random() * 30).toFixed(1)),
    co2: Number((300 + Math.random() * 200).toFixed(0)),
  };
}
