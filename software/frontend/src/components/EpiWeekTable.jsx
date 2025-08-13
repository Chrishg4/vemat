import React from "react";
import { useDashboardData } from "../context/DashboardContext";
import { getEpiWeek } from "../utils/epiWeek";

export default function EpiWeekTable() {
  const { data } = useDashboardData();

  const groupedData = data.reduce((acc, item) => {
    const epiWeek = getEpiWeek(item.fecha);
    const weekKey = `${epiWeek.year}-${String(epiWeek.week).padStart(2, '0')}`;

    if (!acc[weekKey]) {
      acc[weekKey] = {
        totalTemp: 0,
        totalHum: 0,
        totalCo2: 0,
        totalSound: 0,
        count: 0,
        name: `SE ${epiWeek.week}/${epiWeek.year}`,
      };
    }
    acc[weekKey].totalTemp += parseFloat(item.temperatura);
    acc[weekKey].totalHum += parseFloat(item.humedad);
    acc[weekKey].totalCo2 += parseFloat(item.co2);
    acc[weekKey].totalSound += parseFloat(item.acustica);
    acc[weekKey].count += 1;
    return acc;
  }, {});

  const tableData = Object.values(groupedData).map((week) => ({
    name: week.name,
    avgTemp: (week.totalTemp / week.count).toFixed(2),
    avgHum: (week.totalHum / week.count).toFixed(2),
    avgCo2: (week.totalCo2 / week.count).toFixed(2),
    avgSound: (week.totalSound / week.count).toFixed(2),
  })).sort((a, b) => a.name.localeCompare(b.name));

  if (!tableData || tableData.length === 0) {
    return <p className="text-white">Cargando datos de semana epidemiológica...</p>;
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-full">
      <h2 className="text-white text-xl font-semibold mb-4">
        Datos Agregados por Semana Epidemiológica
      </h2>
      <div className="overflow-auto max-h-[400px] no-scrollbar">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs border-b border-gray-600 sticky top-0 bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-cyan-400">Semana Epidemiológica</th>
              <th className="px-4 py-3 text-left text-cyan-400">Temp. Promedio (°C)</th>
              <th className="px-4 py-3 text-left text-cyan-400">Hum. Promedio (%)</th>
              <th className="px-4 py-3 text-left text-cyan-400">CO₂ Promedio (ppm)</th>
              <th className="px-4 py-3 text-left text-cyan-400">Bioacustica Promedio (Hz)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{row.avgTemp}</td>
                <td className="px-4 py-3">{row.avgHum}</td>
                <td className="px-4 py-3">{row.avgCo2}</td>
                <td className="px-4 py-3">{row.avgSound}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}