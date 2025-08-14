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
import { useContextoTablero } from "../context/contextoTablero";
import { aggregateByEpiWeek } from "../utils/utilidadesSemanaEpi";

export default function CO2EpiWeekChart() {
  const { data } = useContextoTablero();

  const chartData = aggregateByEpiWeek(data);

  // Function to format numbers to one decimal place
  const formatNumber = (value) => value.toFixed(1);

  return (
    <div className="chart-container bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-white text-xl font-semibold mb-4">
        Evolución de Datos por Semana Epidemiológica
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            label={{ value: "°C / %", angle: -90, position: "insideLeft", fill: "#ccc" }}
            tick={{ fill: "#ccc" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "CO₂ ppm / Bioacustica (Hz)", angle: 90, position: "insideRight", fill: "#ccc" }}
            tick={{ fill: "#ccc" }}
            tickFormatter={formatNumber}
          />
          <Tooltip formatter={formatNumber} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperatura"
            stroke="#ff7300"
            dot={true}
            name="Temperatura (°C)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="humedad"
            stroke="#387908"
            dot={true}
            name="Humedad (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="co2"
            stroke="#0088FE"
            dot={true}
            name="CO₂ (ppm)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="acustica"
            stroke="#FF0000"
            dot={true}
            name="Bioacustica (Hz)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}