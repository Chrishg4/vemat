// src/components/CurrentReadings.jsx
import React from 'react';
import { FaLaptop, FaThermometerHalf, FaTint, FaSmog } from 'react-icons/fa';

export default function CurrentReadings({ data }) {
  // Aseguramos que los datos existan para evitar errores, mostrando 'N/A' si no.
  const temperatura = data?.temperatura ?? 'N/A';
  const humedad = data?.humedad ?? 'N/A';
  const co2 = data?.co2 ?? 'N/A';

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <FaLaptop className="mr-3 text-blue-400 text-2xl" />
        Lecturas actuales
      </h2>
      <ul className="space-y-3 text-gray-200">
        <li className="flex items-center text-lg">
          <FaThermometerHalf className="mr-3 text-red-400" />
          Temperatura: <span className="font-bold ml-2">{temperatura} °C</span>
        </li>
        <li className="flex items-center text-lg">
          <FaTint className="mr-3 text-blue-400" />
          Humedad: <span className="font-bold ml-2">{humedad} %</span>
        </li>
        <li className="flex items-center text-lg">
          <FaSmog className="mr-3 text-green-400" />
          CO₂: <span className="font-bold ml-2">{co2} ppm</span>
        </li>
      </ul>
    </div>
  );
}