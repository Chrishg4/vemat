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
      <ResponsiveContainer width="100%" height={320}>
        <ChartComponent data={processedChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ia-border)" opacity={0.5} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--ia-text-secondary)", fontSize: 10 }}
            axisLine={{ stroke: "var(--ia-border)" }}
            tickLine={{ stroke: "var(--ia-border)" }}
            label={{ value: xAxisLabel, position: "insideBottom", offset: -5, fill: "var(--ia-text-secondary)", fontSize: 12 }}
            height={50}
          />
          {(!showOnly || showOnly === 'temperatura' || showOnly === 'humedad') && (
            <YAxis
              yAxisId="left"
              label={{ value: "°C / %", angle: -90, position: "insideLeft", fill: "var(--ia-text-secondary)" }}
              tick={{ fill: "var(--ia-text-secondary)", fontSize: 10 }}
              axisLine={{ stroke: "var(--ia-border)" }}
              tickLine={{ stroke: "var(--ia-border)" }}
              width={40}
            />
          )}
          {(!showOnly || showOnly === 'co2' || showOnly === 'acustica') && (
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: showOnly === 'co2' ? "CO₂ (ppm)" : (showOnly === 'acustica' ? "Bioacústica (Hz)" : "CO₂ (ppm) / Bioacústica (Hz)"), angle: 90, position: "insideRight", fill: "var(--ia-text-secondary)" }}
              tick={{ fill: "var(--ia-text-secondary)", fontSize: 10 }}
              axisLine={{ stroke: "var(--ia-border)" }}
              tickLine={{ stroke: "var(--ia-border)" }}
              width={40}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--ia-card)",
              borderColor: "var(--ia-border)",
              color: "var(--ia-text)",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "10px"
            }}
            labelStyle={{ color: "var(--ia-text)", fontWeight: "bold", marginBottom: "5px" }}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Legend
            wrapperStyle={{ color: "var(--ia-text-secondary)", paddingTop: "10px" }}
            iconType="circle"
          />
          {(!showOnly || showOnly === 'temperatura') && (
            <ChartElement
              type={chartMode === 'area' ? 'area' : 'line'}
              dataKey="temperatura"
              name="Temperatura (°C)"
              stroke="var(--ia-error)"
              fill="url(#colorTemp)"
              fillOpacity={chartMode === 'area' ? 0.6 : 0}
              yAxisId="left"
              dot={false}
              strokeWidth={2}
              activeDot={{ r: 6, stroke: 'var(--ia-error)', strokeWidth: 2, fill: 'var(--ia-background)' }}
            />
          )}
          {(!showOnly || showOnly === 'humedad') && (
            <ChartElement
              type={chartMode === 'area' ? 'area' : 'line'}
              dataKey="humedad"
              name="Humedad (%)"
              stroke="var(--ia-info)"
              fill="url(#colorHum)"
              fillOpacity={chartMode === 'area' ? 0.6 : 0}
              yAxisId="left"
              dot={false}
              strokeWidth={2}
              activeDot={{ r: 6, stroke: 'var(--ia-info)', strokeWidth: 2, fill: 'var(--ia-background)' }}
            />
          )}
          {(!showOnly || showOnly === 'co2') && (
            <ChartElement
              type={chartMode === 'area' ? 'area' : 'line'}
              dataKey="co2"
              name="CO₂ (ppm)"
              stroke="var(--ia-warning)"
              fill="url(#colorCO2)"
              fillOpacity={chartMode === 'area' ? 0.6 : 0}
              yAxisId="right"
              dot={false}
              strokeWidth={2}
              activeDot={{ r: 6, stroke: 'var(--ia-warning)', strokeWidth: 2, fill: 'var(--ia-background)' }}
            />
          )}
          {(!showOnly || showOnly === 'acustica') && (
            <ChartElement
              type={chartMode === 'area' ? 'area' : 'line'}
              dataKey="acustica"
              name="Bioacústica (Hz)"
              stroke="var(--ia-success)"
              fill="url(#colorAcus)"
              fillOpacity={chartMode === 'area' ? 0.6 : 0}
              yAxisId="right"
              dot={false}
              strokeWidth={2}
              activeDot={{ r: 6, stroke: 'var(--ia-success)', strokeWidth: 2, fill: 'var(--ia-background)' }}
            />
          )}
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--ia-error)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--ia-error)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--ia-info)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--ia-info)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--ia-warning)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--ia-warning)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorAcus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--ia-success)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--ia-success)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </ChartComponent>
      </ResponsiveContainer>
  );
}
