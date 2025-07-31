import React from "react";

export default function CurrentReadings({ lectura }) {
  if (!lectura) return <div>Cargando datos...</div>;

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Lecturas Actuales</h2>
      <div className="space-y-3 text-gray-300">
        <p><span className="text-blue-400 font-medium">Fecha:</span> {lectura.date}</p>
        <p><span className="text-blue-400 font-medium">Temperatura:</span> {lectura.temperatura} °C</p>
        <p><span className="text-blue-400 font-medium">Humedad:</span> {lectura.humedad} %</p>
        <p><span className="text-blue-400 font-medium">CO₂:</span> {lectura.co2} ppm</p>
        <p><span className="text-blue-400 font-medium">Ciudad:</span> {lectura.city}</p>
      </div>
    </div>
  );
}
