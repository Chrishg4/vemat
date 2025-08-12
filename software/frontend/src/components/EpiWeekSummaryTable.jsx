
import React from 'react';

const formatValue = (value, decimals = 2) => {
  if (value === null || value === undefined || !isFinite(value)) return 'N/A';
  return value.toFixed(decimals);
};

const EpiWeekSummaryTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-400">No hay datos disponibles para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 border border-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="py-3 px-4 border-b border-gray-600 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider" rowSpan="2">Semana Epi.</th>
            <th className="py-3 px-4 border-b border-gray-600 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider" colSpan="3">Temperatura (°C)</th>
            <th className="py-3 px-4 border-b border-gray-600 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider" colSpan="3">Humedad (%)</th>
            <th className="py-3 px-4 border-b border-gray-600 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider" colSpan="3">CO2 (ppm)</th>
            <th className="py-3 px-4 border-b border-gray-600 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider" colSpan="3">Acustica (dB)</th>
          </tr>
          <tr>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Prom.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Mín.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Máx.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Prom.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Mín.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Máx.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Prom.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Mín.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Máx.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Prom.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Mín.</th>
            <th className="py-2 px-3 border-b border-gray-600 text-center text-xs font-medium text-gray-400">Máx.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((week) => (
            <tr key={week.key} className="hover:bg-gray-700">
              <td className="py-3 px-4 whitespace-nowrap font-medium text-white">{week.name}</td>
              {/* Temperatura */}
              <td className="py-3 px-4 whitespace-nowrap text-center text-gray-300">{formatValue(week.temperatura.avg)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center text-blue-400">{formatValue(week.temperatura.min)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center text-red-400">{formatValue(week.temperatura.max)}</td>
              {/* Humedad */}
              <td className="py-3 px-4 whitespace-nowrap text-center text-gray-300">{formatValue(week.humedad.avg)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center text-blue-400">{formatValue(week.humedad.min)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center text-red-400">{formatValue(week.humedad.max)}</td>
              {/* CO2 */}
              <td className="py-3 px-4 whitespace-nowrap text-center text-gray-300">{formatValue(week.co2.avg, 0)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center text-blue-400">{formatValue(week.co2.min, 0)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center text-red-400">{formatValue(week.co2.max, 0)}</td>
              {/* Acustica */}
              <td className="py-3 px-4 whitespace-nowrap text-center text-gray-300">{formatValue(week.acustica.avg)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center text-blue-400">{formatValue(week.acustica.min)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center text-red-400">{formatValue(week.acustica.max)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EpiWeekSummaryTable;
