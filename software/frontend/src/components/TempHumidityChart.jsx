// src/components/TempHumidityChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useDashboardData } from "../context/DashboardContext";

export default function TempHumidityChart() {
  const { data, soundHistory } = useDashboardData();

  // Transformar los datos para el gráfico
  const chartData = data.map((item) => {
    const soundReading = soundHistory.find(s => {
        if (!s.fecha || !item.fecha) return false;
        return new Date(s.fecha).getTime() === new Date(item.fecha).getTime();
    });
    return {
        name: new Date(item.fecha).toLocaleString("es-CR", {
        timeZone: "UTC",
        }),
        temperatura: parseFloat(item.temperatura),
        humedad: parseFloat(item.humedad),
        co2: parseFloat(item.co2),
        sonido: typeof soundReading?.sonido === 'number' ? soundReading.sonido : 0,
    }
  });

  return (
    <div className="chart-container bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-white text-xl font-semibold mb-4">
        Gráfica de Datos
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
            dot={false}
            name="Temperatura (°C)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="humedad"
            stroke="#387908"
            dot={false}
            name="Humedad (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="co2"
            stroke="#0088FE"
            dot={false}
            name="CO₂ (ppm)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sonido"
            stroke="#FF0000"
            dot={false}
            name="Sonido (Hz)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}