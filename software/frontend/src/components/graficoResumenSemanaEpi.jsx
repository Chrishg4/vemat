
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
  temperatura: { label: 'Temperatura', unit: '°C', color: 'var(--ia-warning)' },
  humedad: { label: 'Humedad', unit: '%', color: 'var(--ia-success)' },
  co2: { label: 'CO2', unit: 'ppm', color: 'var(--ia-info)' },
  acustica: { label: 'Bioacustica', unit: 'Hz', color: 'var(--ia-error)' },
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
    <div className="chart-container bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border">
      <h2 className="text-ia-text text-xl font-semibold mb-4">
        Gráfica de Resumen por Semana Epidemiológica
      </h2>
      <div className="mb-4 flex items-center">
        <label htmlFor="metric-select" className="mr-2 font-semibold text-ia-text-secondary">Seleccionar Métrica:</label>
        <div className="relative inline-block w-[140px]">
          <select
            id="metric-select"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="appearance-none border border-ia-accent rounded-lg px-3 py-2 pr-8 bg-ia-background text-ia-text font-semibold focus:outline-none focus:ring-2 focus:ring-ia-accent shadow cursor-pointer transition duration-150 w-full"
          >
            {Object.keys(metricOptions).map(key => (
              <option key={key} value={key}>{metricOptions[key].label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-ia-accent">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-ia-text"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ia-border)" />
          <XAxis dataKey="name" tick={{ fill: "var(--ia-text-secondary)", fontSize: 12 }} label={{ value: "Semana Epidemiológica", position: "insideBottom", offset: -5, fill: "var(--ia-text-secondary)" }} />
          <YAxis
            label={{ value: `${currentMetric.label} (${currentMetric.unit})`, angle: -90, position: "insideLeft", fill: "var(--ia-text-secondary)" }}
            tick={{ fill: "var(--ia-text-secondary)" }}
            tickFormatter={formatNumber}
          />
          <Tooltip formatter={(value) => [`${formatNumber(value)} ${currentMetric.unit}`, '']} />
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
            stroke="var(--ia-accent)"
            strokeDasharray="5 5"
            dot={false}
            name={`Mínimo ${currentMetric.label}`}
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="var(--ia-primary)"
            strokeDasharray="5 5"
            dot={false}
            name={`Máximo ${currentMetric.label}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoResumenSemanaEpi;
