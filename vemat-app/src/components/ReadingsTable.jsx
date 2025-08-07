import React from "react";
import { useDashboardData } from "../context/DashboardContext";

export default function ReadingsTable() {
  const { data } = useDashboardData();

  if (!data || data.length === 0) {
    return <p className="text-white">Cargando historial...</p>;
  }

  const lecturas2025 = data.filter((lectura) => {
    const fecha = new Date(lectura.fecha);
    return fecha.getFullYear() === 2025;
  });

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-white text-xl font-semibold mb-4">
        Historial de Lecturas
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs border-b border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-cyan-400">Fecha</th>
              <th className="px-4 py-3 text-left text-cyan-400">Temperatura</th>
              <th className="px-4 py-3 text-left text-cyan-400">Humedad</th>
              <th className="px-4 py-3 text-left text-cyan-400">CO₂</th>
              <th className="px-4 py-3 text-left text-cyan-400">Ciudad</th>
            </tr>
          </thead>
          <tbody>
            {lecturas2025.map((lectura, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">{new Date(lectura.fecha).toLocaleString()}</td>
                <td className="px-4 py-3">{lectura.temperatura} °C</td>
                <td className="px-4 py-3">{lectura.humedad} %</td>
                <td className="px-4 py-3">{lectura.co2} ppm</td>
                <td className="px-4 py-3">Cañas</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
