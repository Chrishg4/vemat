// src/components/TempHumidityChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useDashboardData } from "../context/DashboardContext";
export default function TempHumidityChart({ chartMode = 'line' }) {
  const { data, soundHistory } = useDashboardData();

  let processedChartData;
  let xAxisLabel = 'Fecha/Hora';

  processedChartData = data.map((item) => {
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
        acustica: typeof soundReading?.acustica === 'number' ? soundReading.acustica : 0,
    }
  });

  const ChartComponent = chartMode === 'bar' ? BarChart : (chartMode === 'area' ? AreaChart : LineChart);
  const ChartElement = chartMode === 'bar' ? Bar : (chartMode === 'area' ? Area : Line);

  return (
    <div className="chart-container bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-white text-xl font-semibold mb-4">
        Gráfica de Datos
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <ChartComponent data={processedChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 12 }} label={{ value: xAxisLabel, position: "insideBottom", offset: -5, fill: "#ccc" }} />
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
          />
          <Tooltip />
          <Legend />
          <ChartElement
            yAxisId="left"
            type={chartMode === 'line' ? "monotone" : undefined}
            dataKey="temperatura"
            stroke="#ff7300"
            fill={chartMode === 'area' ? "rgba(255, 115, 0, 0.3)" : "#ff7300"}
            dot={chartMode === 'line' ? false : undefined}
            name="Temperatura (°C)"
          />
          <ChartElement
            yAxisId="left"
            type={chartMode === 'line' ? "monotone" : undefined}
            dataKey="humedad"
            stroke="#387908"
            fill={chartMode === 'area' ? "rgba(56, 121, 8, 0.3)" : "#387908"}
            dot={chartMode === 'line' ? false : undefined}
            name="Humedad (%)"
          />
          <ChartElement
            yAxisId="right"
            type={chartMode === 'line' ? "monotone" : undefined}
            dataKey="co2"
            stroke="#0088FE"
            fill={chartMode === 'area' ? "rgba(0, 136, 254, 0.3)" : "#0088FE"}
            dot={chartMode === 'line' ? false : undefined}
            name="CO₂ (ppm)"
          />
          <ChartElement
            yAxisId="right"
            type={chartMode === 'line' ? "monotone" : undefined}
            dataKey="acustica"
            stroke="#FF0000"
            fill={chartMode === 'area' ? "rgba(255, 0, 0, 0.3)" : "#FF0000"}
            dot={chartMode === 'line' ? false : undefined}
            name="Bioacustica (Hz)"
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}