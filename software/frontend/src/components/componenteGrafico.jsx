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
              color: 'var(--ia-text)',
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha/Hora',
              color: 'var(--ia-text)',
            },
            grid: {
              color: 'var(--ia-border)',
            },
            ticks: {
              color: 'var(--ia-text-secondary)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Valor',
              color: 'var(--ia-text)',
            },
            grid: {
              color: 'var(--ia-border)',
            },
            ticks: {
              color: 'var(--ia-text-secondary)',
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
    <div className="bg-ia-card p-6 rounded-lg shadow-md h-96 transition-colors duration-500">
      <h2 className="text-xl font-semibold text-ia-text mb-4 flex items-center space-x-2">
        <span className="text-ia-accent text-2xl">📈</span>
        <span>Temperatura y Humedad</span>
      </h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ChartComponent;