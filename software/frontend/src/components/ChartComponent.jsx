import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ChartComponent({ chartData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: chartData.temperature,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Humedad (%)',
            data: chartData.humidity,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'rgb(209 213 219)',
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha/Hora',
              color: 'rgb(209 213 219)',
            },
            grid: {
              color: 'rgba(75, 85, 99, 0.5)',
            },
            ticks: {
              color: 'rgb(209 213 219)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Valor',
              color: 'rgb(209 213 219)',
            },
            grid: {
              color: 'rgba(75, 85, 99, 0.5)',
            },
            ticks: {
              color: 'rgb(209 213 219)',
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl h-96">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
        <span className="text-cyan-400 text-2xl">📈</span>
        <span>Temperatura y Humedad</span>
      </h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ChartComponent;