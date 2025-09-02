import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function BioacusticaChart({ data }) {
  
  const processData = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData
      .map(item => {
        const timestamp = new Date(item.fecha);
        const value = typeof item.acustica === 'number' ? item.acustica : 0;
        
        return {
          name: timestamp.toLocaleString('es-CR', {
            timeZone: "UTC",
          }),
          timestamp,
          value,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const chartData = processData(data);

  return (
    <div className="chart-container bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-white text-xl font-semibold mb-4">Monitoreo Bioacústico</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 12 }} label={{ value: 'Fecha/Hora', position: "insideBottom", offset: -5, fill: "#ccc" }} />
          <YAxis
            label={{ value: "Bioacústica (Hz)", angle: -90, position: "insideLeft", fill: "#ccc" }}
            tick={{ fill: "#ccc" }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF0000"
            dot={false}
            name="Bioacústica (Hz)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}