
import React, { useState } from 'react';
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

const metricOptions = {
  temperatura: { label: 'Temperatura', unit: '°C', color: '#ff7300' },
  humedad: { label: 'Humedad', unit: '%', color: '#387908' },
  co2: { label: 'CO2', unit: 'ppm', color: '#0088FE' },
  acustica: { label: 'Bioacustica', unit: 'Hz', color: '#FF0000' },
};

const GraficoResumenSemanaEpi = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('temperatura');

  if (!data || data.length === 0) {
    return <p className="text-white">No hay datos disponibles para mostrar el gráfico.</p>;
  }

  const currentMetric = metricOptions[selectedMetric];

  // Prepare data for recharts
  const chartData = data.map(week => ({
    name: week.name,
    avg: week[selectedMetric].avg,
    min: week[selectedMetric].min,
    max: week[selectedMetric].max,
  }));

  // Function to format numbers for Tooltip and YAxis
  const formatNumber = (value) => {
    if (selectedMetric === 'co2') {
      return value.toFixed(0); // CO2 is typically integer
    }
    return value.toFixed(2);
  };

  return (
    <div className="chart-container bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-white text-xl font-semibold mb-4">
        Gráfica de Resumen por Semana Epidemiológica
      </h2>
      <div className="mb-4 flex items-center">
        <label htmlFor="metric-select" className="mr-2 font-semibold text-gray-300">Seleccionar Métrica:</label>
        <select
          id="metric-select"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="px-3 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow bg-gray-800 text-cyan-300 hover:bg-cyan-700"
        >
          {Object.keys(metricOptions).map(key => (
            <option key={key} value={key}>{metricOptions[key].label}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 12 }} label={{ value: "Semana Epidemiológica", position: "insideBottom", offset: -5, fill: "#ccc" }} />
          <YAxis
            label={{ value: `${currentMetric.label} (${currentMetric.unit})`, angle: -90, position: "insideLeft", fill: "#ccc" }}
            tick={{ fill: "#ccc" }}
            tickFormatter={formatNumber}
          />
          <Tooltip formatter={(value) => [`${formatNumber(value)} ${currentMetric.unit}`, '']}/>
          <Legend />
          <Line
            type="monotone"
            dataKey="avg"
            stroke={currentMetric.color}
            strokeWidth={2}
            dot={false}
            name={`Promedio ${currentMetric.label}`}
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#8884d8" // A different color for min
            strokeDasharray="5 5" // Dashed line for min
            dot={false}
            name={`Mínimo ${currentMetric.label}`}
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#82ca9d" // A different color for max
            strokeDasharray="5 5" // Dashed line for max
            dot={false}
            name={`Máximo ${currentMetric.label}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoResumenSemanaEpi;
