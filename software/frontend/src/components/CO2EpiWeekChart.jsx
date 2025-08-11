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
import { useDashboardData } from "../context/DashboardContext";
import { getEpiWeek } from "../utils/epiWeek";

export default function CO2EpiWeekChart() {
  const { data } = useDashboardData();

  const groupedData = data.reduce((acc, item) => {
    const epiWeek = getEpiWeek(item.fecha);
    const weekKey = `${epiWeek.year}-${String(epiWeek.week).padStart(2, '0')}`;

    if (!acc[weekKey]) {
      acc[weekKey] = { 
        totalCo2: 0, 
        totalTemp: 0, 
        totalHum: 0, 
        totalSound: 0, 
        count: 0, 
        name: `SE ${epiWeek.week}/${epiWeek.year}` 
      };
    }
    acc[weekKey].totalCo2 += parseFloat(item.co2);
    acc[weekKey].totalTemp += parseFloat(item.temperatura);
    acc[weekKey].totalHum += parseFloat(item.humedad);
    acc[weekKey].totalSound += parseFloat(item.sonido);
    acc[weekKey].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(groupedData).map(week => ({
    name: week.name,
    co2: week.totalCo2 / week.count,
    temperatura: week.totalTemp / week.count,
    humedad: week.totalHum / week.count,
    sonido: week.totalSound / week.count,
  })).sort((a, b) => a.name.localeCompare(b.name));

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
            label={{ value: "CO₂ ppm / Sonido (Hz)", angle: 90, position: "insideRight", fill: "#ccc" }}
            tick={{ fill: "#ccc" }}
          />
          <Tooltip />
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
            dataKey="sonido"
            stroke="#FF0000"
            dot={true}
            name="Sonido (Hz)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}