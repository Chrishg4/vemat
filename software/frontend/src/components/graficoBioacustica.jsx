// src/components/BioacusticaChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function BioacusticaChart({ data }) {
  const chartData = data.map(item => ({
    name: new Date(item.fecha).toLocaleString('es-CR', {
      timeZone: 'UTC',
    }),
    acustica: typeof item.acustica === 'number' ? item.acustica : 0,
  }));

  return (
    <div className="chart-container bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-white text-xl font-semibold mb-4">Gráfico de Bioacustica (Hz)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" tick={{ fill: '#ccc', fontSize: 12 }} />
          <YAxis
            label={{ value: 'Hz', angle: -90, position: 'insideLeft', fill: '#ccc' }}
            tick={{ fill: '#ccc' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="acustica"
            stroke="#8884d8"
            dot={false}
            name="Bioacustica (Hz)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}