import React from 'react';

function CurrentReadings({ temperature, humidity, co2 }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
        <span className="text-blue-400 text-2xl">📖</span>
        <span>Lecturas actuales</span>
      </h2>
      <ul className="text-white space-y-3 flex-grow">
        <li className="flex items-center space-x-2">
          <span className="text-red-400">🌡️</span>
          <span>Temperatura: <span className="font-bold">{temperature}</span> °C</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-blue-400">💧</span>
          <span>Humedad: <span className="font-bold">{humidity}</span> %</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-yellow-400">☁️</span> {/* Cambié el icono para CO2 para que coincida más */}
          <span>CO₂: <span className="font-bold">{co2}</span> ppm</span>
        </li>
      </ul>
    </div>
  );
}

export default CurrentReadings;