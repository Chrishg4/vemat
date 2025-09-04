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
    <div className="chart-container bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border transition-colors duration-500">
      <h2 className="text-ia-text text-xl font-semibold mb-4">Monitoreo Bioacústico</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ia-border)" />
          <XAxis dataKey="name" tick={{ fill: "var(--ia-text-secondary)", fontSize: 12 }} label={{ value: 'Fecha/Hora', position: "insideBottom", offset: -5, fill: "var(--ia-text-secondary)" }} />
          <YAxis
            label={{ value: "Bioacústica (Hz)", angle: -90, position: "insideLeft", fill: "var(--ia-text-secondary)" }}
            tick={{ fill: "var(--ia-text-secondary)" }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--ia-error)"
            dot={false}
            name="Bioacústica (Hz)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}