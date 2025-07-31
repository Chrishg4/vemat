import React from "react";

export default function ReadingsTable({ historial }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">Historial de Lecturas</h2>
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-blue-400">
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Temp (°C)</th>
            <th className="px-4 py-2">Humedad (%)</th>
            <th className="px-4 py-2">CO₂ (ppm)</th>
            <th className="px-4 py-2">Ciudad</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {historial.map((lectura, index) => (
            <tr key={index} className="text-center border-t border-gray-800 hover:bg-gray-800">
              <td className="px-4 py-2">{lectura.date}</td>
              <td className="px-4 py-2">{lectura.temperatura}</td>
              <td className="px-4 py-2">{lectura.humedad}</td>
              <td className="px-4 py-2">{lectura.co2}</td>
              <td className="px-4 py-2">{lectura.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
