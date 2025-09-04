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
import { useContextoTablero } from "../context/contextoTablero";

export default function TempHumidityChart({ chartMode = 'line', showOnly = null, title = 'Gráfica de Datos' }) {
  const { data, soundHistory } = useContextoTablero();

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
    };
  });

  const ChartComponent = chartMode === 'bar' ? BarChart : (chartMode === 'area' ? AreaChart : LineChart);
  const ChartElement = chartMode === 'bar' ? Bar : (chartMode === 'area' ? Area : Line);

  return (
    <div className="chart-container bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border transition-colors duration-500">
      <h2 className="text-ia-text text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={320}>
        <ChartComponent data={processedChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ia-border)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--ia-text-secondary)", fontSize: 12 }}
            label={{ value: xAxisLabel, position: "insideBottom", offset: -5, fill: "var(--ia-text-secondary)" }}
          />
          {(!showOnly || showOnly === 'temperatura' || showOnly === 'humedad') && (
            <YAxis
              yAxisId="left"
              label={{ value: "°C / %", angle: -90, position: "insideLeft", fill: "var(--ia-text-secondary)" }}
              tick={{ fill: "var(--ia-text-secondary)" }}
            />
          )}
          {(!showOnly || showOnly === 'co2' || showOnly === 'acustica') && (
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: showOnly === 'co2' ? "CO₂ (ppm)" : (showOnly === 'acustica' ? "Bioacústica (Hz)" : "CO₂ (ppm) / Bioacústica (Hz)"), angle: 90, position: "insideRight", fill: "var(--ia-text-secondary)" }}
              tick={{ fill: "var(--ia-text-secondary)" }}
            />
          )}
          <Tooltip />
          <Legend />
          {(!showOnly || showOnly === 'temperatura') && (
            <ChartElement
              yAxisId="left"
              type={chartMode === 'line' ? "monotone" : undefined}
              dataKey="temperatura"
              stroke="var(--ia-warning)"
              fill={chartMode === 'area' ? "var(--ia-warning-bg)" : "var(--ia-warning)"}
              dot={chartMode === 'line' ? false : undefined}
              name="Temperatura (°C)"
            />
          )}
          {(!showOnly || showOnly === 'humedad') && (
            <ChartElement
              yAxisId="left"
              type={chartMode === 'line' ? "monotone" : undefined}
              dataKey="humedad"
              stroke="var(--ia-success)"
              fill={chartMode === 'area' ? "var(--ia-success-bg)" : "var(--ia-success)"}
              dot={chartMode === 'line' ? false : undefined}
              name="Humedad (%)"
            />
          )}
          {(!showOnly || showOnly === 'co2') && (
            <ChartElement
              yAxisId="right"
              type={chartMode === 'line' ? "monotone" : undefined}
              dataKey="co2"
              stroke="var(--ia-info)"
              fill={chartMode === 'area' ? "var(--ia-info-bg)" : "var(--ia-info)"}
              dot={chartMode === 'line' ? false : undefined}
              name="CO₂ (ppm)"
            />
          )}
          {(!showOnly || showOnly === 'acustica') && (
            <ChartElement
              yAxisId="right"
              type={chartMode === 'line' ? "monotone" : undefined}
              dataKey="acustica"
              stroke="var(--ia-error)"
              fill={chartMode === 'area' ? "var(--ia-error-bg)" : "var(--ia-error)"}
              dot={chartMode === 'line' ? false : undefined}
              name="Bioacústica (Hz)"
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}