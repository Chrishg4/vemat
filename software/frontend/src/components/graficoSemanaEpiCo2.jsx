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
import { useContextoTablero } from "../context/contextoTablero";
import { aggregateByEpiWeek } from "../utils/utilidadesSemanaEpi";

export default function CO2EpiWeekChart() {
  const { data } = useContextoTablero();
  const [selectedYear, setSelectedYear] = useState(null);

  const years = [...new Set(data.map(item => new Date(item.fecha).getFullYear()))].sort((a, b) => b - a);
  const mostRecentYear = years.length > 0 ? years[0] : null;

  if (selectedYear === null && mostRecentYear !== null) {
    setSelectedYear(mostRecentYear);
  }

  const filteredData = selectedYear ? data.filter(item => new Date(item.fecha).getFullYear() === selectedYear) : [];

  const chartData = aggregateByEpiWeek(filteredData);

  // Function to format numbers to one decimal place
  const formatNumber = (value) => value.toFixed(1);

  return (
    <div className="chart-container bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border">
      <div className="flex flex-col items-start mb-4">
        <h2 className="text-ia-text text-xl font-semibold mb-4">
          Evolución de Datos por Semana Epidemiológica
        </h2>
        <div className="flex items-center">
          <span className="text-ia-text-secondary font-semibold mr-2">Filtrar por año:</span>
          {years.length > 0 && (
            <div className="relative inline-block w-[140px]">
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="appearance-none border border-ia-accent rounded-lg px-3 py-2 pr-8 bg-ia-background text-ia-text font-semibold focus:outline-none focus:ring-2 focus:ring-ia-accent shadow cursor-pointer transition duration-150 w-full"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ia-border)" />
          <XAxis dataKey="name" tick={{ fill: "var(--ia-text-secondary)", fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            label={{ value: "°C / %", angle: -90, position: "insideLeft", fill: "var(--ia-text-secondary)" }}
            tick={{ fill: "var(--ia-text-secondary)" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "CO₂ ppm / Bioacustica (Hz)", angle: 90, position: "insideRight", fill: "var(--ia-text-secondary)" }}
            tick={{ fill: "var(--ia-text-secondary)" }}
            tickFormatter={formatNumber}
          />
          <Tooltip formatter={formatNumber} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperatura"
            stroke="var(--ia-warning)"
            dot={true}
            name="Temperatura (°C)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="humedad"
            stroke="var(--ia-success)"
            dot={true}
            name="Humedad (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="co2"
            stroke="var(--ia-info)"
            dot={true}
            name="CO₂ (ppm)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="acustica"
            stroke="var(--ia-error)"
            dot={true}
            name="Bioacustica (Hz)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
