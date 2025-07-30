// src/components/TempHumidityChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes de Chart.js que vamos a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TempHumidityChart({ chartData }) {
  const data = {
    labels: chartData.labels, // Array con fechas/horas
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: chartData.temperatures.map(Number), // Convertir a números
        borderColor: 'rgb(255, 99, 132)', // rojo
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Humedad (%)',
        data: chartData.humidities.map(Number), // Convertir a números
        borderColor: 'rgb(53, 162, 235)', // azul
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Para controlar alto con CSS
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1', // gris claro
        },
      },
      title: {
        display: true,
        text: 'Temperatura y Humedad',
        color: '#f8fafc', // casi blanco
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        title: {
          display: true,
          text: 'Fecha/Hora',
          color: '#f8fafc',
          font: { size: 14 },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        title: {
          display: true,
          text: 'Temperatura (°C)',
          color: '#f8fafc',
          font: { size: 14 },
        },
        min: 0,
        max: 35,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false, color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#cbd5e1' },
        title: {
          display: true,
          text: 'Humedad (%)',
          color: '#f8fafc',
          font: { size: 14 },
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg h-80 md:h-96 flex flex-col">
      <Line data={data} options={options} />
    </div>
  );
}
