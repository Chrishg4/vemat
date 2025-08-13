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

// Helper function to generate all 52 epidemiological weeks for a given year
const getFullEpiWeeks = (year) => {
  const weeks = [];
  // Determine the start of Epi Week 1 for the given year
  // For 2025, Jan 1 is a Wednesday, so Epi Week 1 starts on Dec 29, 2024
  let currentWeekStart = new Date(`${year - 1}-12-29T00:00:00`); // Start of Epi Week 1, 2025

  for (let i = 1; i <= 52; i++) {
    const weekName = `SE ${i}/${year}`;
    weeks.push({
      name: weekName,
      co2: null,
      temperatura: null,
      humedad: null,
      acustica: null,
      // Store the weekKey for easy lookup
      weekKey: `${year}-${String(i).padStart(2, '0')}`
    });
    currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Move to the start of the next week
  }
  return weeks;
};

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
    acc[weekKey].totalSound += parseFloat(item.acustica);
    acc[weekKey].count += 1;
    return acc;
  }, {});

  // Generate all 52 weeks for 2025
  const fullEpiWeeksData = getFullEpiWeeks(2025);

  // Merge actual data with the full list of weeks
  const chartData = fullEpiWeeksData.map(fullWeek => {
    const actualWeekData = groupedData[fullWeek.weekKey];
    if (actualWeekData) {
      return {
        name: actualWeekData.name,
        co2: actualWeekData.totalCo2 / actualWeekData.count,
        temperatura: actualWeekData.totalTemp / actualWeekData.count,
        humedad: actualWeekData.totalHum / actualWeekData.count,
        acustica: actualWeekData.totalSound / actualWeekData.count,
      };
    }
    return fullWeek; // Return week with nulls if no data
  });

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