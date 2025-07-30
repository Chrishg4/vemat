// src/components/ReadingsTable.jsx
import React from 'react';
import { FaHistory } from 'react-icons/fa';

export default function ReadingsTable({ historyData }) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <FaHistory className="mr-3 text-blue-400 text-2xl" />
        Historial de Lecturas
      </h2>
      <div className="overflow-auto rounded-lg flex-grow">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Ciudad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Temperatura (°C)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Humedad (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                CO₂ (PPM)
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600 text-gray-200">
            {historyData.length > 0 ? (
              historyData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-600 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.temperatura}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.humedad}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.co2}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No hay datos de historial disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}