import React from "react";
import { useDashboardData } from "../context/DashboardContext";

export default function ReadingsTable() {
  const { data } = useDashboardData();

  if (!data || data.length === 0) {
    return <p className="text-white">Cargando historial...</p>;
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-full">
      <h2 className="text-white text-xl font-semibold mb-4">
        Historial de Lecturas
      </h2>
      <div className="overflow-auto h-[220px] no-scrollbar">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs border-b border-gray-600 sticky top-0 bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-cyan-400">Fecha</th>
              <th className="px-4 py-3 text-left text-cyan-400">Temperatura</th>
              <th className="px-4 py-3 text-left text-cyan-400">Humedad</th>
              <th className="px-4 py-3 text-left text-cyan-400">CO₂</th>
              <th className="px-4 py-3 text-left text-cyan-400">Sonido</th>
              <th className="px-4 py-3 text-left text-cyan-400">Ciudad</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((lectura, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">{new Date(lectura.fecha).toLocaleString('es-CR', { timeZone: 'UTC' })}</td>
                <td className="px-4 py-3">{lectura.temperatura} °C</td>
                <td className="px-4 py-3">{lectura.humedad} %</td>
                <td className="px-4 py-3">{lectura.co2} ppm</td>
                <td className="px-4 py-3">{lectura.sonido} Hz</td>
                <td className="px-4 py-3">Cañas</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}