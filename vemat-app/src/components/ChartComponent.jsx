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

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartComponent({ chartData }) {
  const data = {
    labels: chartData.labels, // Asume que chartData.labels es un array de timestamps
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: chartData.temperature,
        borderColor: 'rgb(255, 99, 132)', // Rojo
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'yTemp',
      },
      {
        label: 'Humedad (%)',
        data: chartData.humidity,
        borderColor: 'rgb(53, 162, 235)', // Azul
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'yHum',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1', // Texto de leyenda gris claro para el tema oscuro
        },
      },
      title: {
        display: true,
        text: 'Temperatura y Humedad',
        color: '#cbd5e1', // Título del gráfico gris claro
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Líneas de grid más tenues
        },
        ticks: {
          color: '#cbd5e1', // Color de los ticks del eje X
        },
      },
      yTemp: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#cbd5e1',
        },
      },
      yHum: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false, // Solo dibujar ticks, no la línea de grid
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#cbd5e1',
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl h-full flex flex-col">
      {/* El título se maneja dentro de las opciones del gráfico */}
      <div className="relative h-64"> {/* Define una altura para el gráfico */}
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default ChartComponent;