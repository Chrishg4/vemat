import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale);

export default function TempHumidityChart({ datos }) {
  const data = {
    labels: datos.map((d) => d.date.split(", ")[1]),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: datos.map((d) => d.temperatura),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Humedad (%)",
        data: datos.map((d) => d.humedad),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af' // text-gray-400 para las leyendas
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#374151' // grid-gray-700
        },
        ticks: {
          color: '#9ca3af' // text-gray-400
        }
      },
      y: {
        grid: {
          color: '#374151' // grid-gray-700
        },
        ticks: {
          color: '#9ca3af' // text-gray-400
        }
      }
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Gráfica de Temperatura y Humedad</h2>
      <Line data={data} options={options} />
    </div>
  );
}
