
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const metricOptions = {
  temperatura: { label: 'Temperatura', unit: '°C' },
  humedad: { label: 'Humedad', unit: '%' },
  co2: { label: 'CO2', unit: 'ppm' },
  sonido: { label: 'Sonido', unit: 'dB' },
};

const EpiWeekSummaryChart = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('temperatura');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    const currentMetric = metricOptions[selectedMetric];

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(week => week.name),
        datasets: [
          {
            label: `Promedio (${currentMetric.unit})`,
            data: data.map(week => week[selectedMetric].avg),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.3,
          },
          {
            label: `Mínimo (${currentMetric.unit})`,
            data: data.map(week => week[selectedMetric].min),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderDash: [5, 5], // Línea discontinua
            tension: 0.3,
            fill: false,
          },
          {
            label: `Máximo (${currentMetric.unit})`,
            data: data.map(week => week[selectedMetric].max),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
            position: 'top',
            labels: { color: 'rgb(209 213 219)' }
          },
          title: {
            display: true,
            text: `Resumen de ${currentMetric.label} por Semana Epidemiológica`,
            font: { size: 18 },
            color: 'rgb(209 213 219)',
          },
        },
        scales: {
          x: { 
            title: { display: true, text: 'Semana Epidemiológica', color: 'rgb(209 213 219)' },
            grid: { color: 'rgba(209, 213, 219, 0.2)' },
            ticks: { color: 'rgb(209 213 219)' },
          },
          y: { 
            title: { display: true, text: `Valor (${currentMetric.unit})`, color: 'rgb(209 213 219)' },
            grid: { color: 'rgba(209, 213, 219, 0.2)' },
            ticks: { color: 'rgb(209 213 219)' },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, selectedMetric]);

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="metric-select" className="mr-2 font-semibold text-gray-300">Seleccionar Métrica:</label>
        <select
          id="metric-select"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="p-2 rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        >
          {Object.keys(metricOptions).map(key => (
            <option key={key} value={key}>{metricOptions[key].label}</option>
          ))}
        </select>
      </div>
      <div className="relative h-96">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default EpiWeekSummaryChart;
