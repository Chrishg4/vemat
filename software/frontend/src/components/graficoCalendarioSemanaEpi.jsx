import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // For date handling in Chart.js
import { es } from 'date-fns/locale'; // For Spanish dates

const EpiWeekCalendarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState([]);

  const getEpiWeeks2025 = () => {
    const weeks = [];
    const year = 2025;

    // Determine the start of Epi Week 1 for 2025
    // January 1, 2025 is a Wednesday. The closest Sunday is Dec 29, 2024.
    let currentWeekStart = new Date('2024-12-29T00:00:00'); // Start of Epi Week 1, 2025

    for (let i = 1; i <= 52; i++) {
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // 6 days after start for end of week

      const monthStart = currentWeekStart.toLocaleString('es', { month: 'long', year: 'numeric' }).toUpperCase();
      const monthEnd = currentWeekEnd.toLocaleString('es', { month: 'long', year: 'numeric' }).toUpperCase();

      const startDateFormatted = currentWeekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
      const endDateFormatted = currentWeekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

      weeks.push({
        weekNumber: i,
        startDate: currentWeekStart,
        endDate: currentWeekEnd,
        month: currentWeekStart.getMonth(), // 0-indexed month
        monthName: currentWeekStart.toLocaleString('es', { month: 'long' }).toUpperCase(),
        dateRange: `Semana ${i} – ${startDateFormatted} al ${endDateFormatted}`,
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Move to the start of the next week
    }
    return weeks;
  };

  useEffect(() => {
    const epiWeeks = getEpiWeeks2025();
    setChartData(epiWeeks);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Obtener variables CSS para usar colores consistentes con el tema
    const getCSSVariable = (varName) => {
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    };
    
    // Usar colores del tema para los meses
    const monthColors = [
      'var(--ia-error-bg)',    // Enero 
      'var(--ia-info-bg)',     // Febrero
      'var(--ia-warning-bg)',  // Marzo
      'var(--ia-success-bg)',  // Abril
      'var(--ia-error-bg)',    // Mayo
      'var(--ia-info-bg)',     // Junio
      'var(--ia-warning-bg)',  // Julio
      'var(--ia-success-bg)',  // Agosto
      'var(--ia-error-bg)',    // Septiembre
      'var(--ia-info-bg)',     // Octubre
      'var(--ia-warning-bg)',  // Noviembre
      'var(--ia-success-bg)',  // Diciembre
    ];

    const backgroundColors = epiWeeks.map(week => {
      if (week.weekNumber === 1 || week.weekNumber === 52) {
        return 'var(--ia-error)'; // Destacar semanas 1 y 52 con el color de error
      }
      return monthColors[week.month];
    });

    const borderColors = epiWeeks.map(week => {
      if (week.weekNumber === 1 || week.weekNumber === 52) {
        return 'var(--ia-error)';
      }
      // Para los bordes, usar colores más oscuros
      switch(week.month % 4) {
        case 0: return 'var(--ia-error)';
        case 1: return 'var(--ia-info)';
        case 2: return 'var(--ia-warning)';
        case 3: return 'var(--ia-success)';
      }
    });

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: epiWeeks.map(week => `Semana ${week.weekNumber}`),
        datasets: [
          {
            label: 'Semanas Epidemiológicas 2025',
            data: epiWeeks.map(() => 1), // All bars have the same length
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y', // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const week = epiWeeks[context.dataIndex];
                return week.dateRange;
              },
              title: function(context) {
                const week = epiWeeks[context.dataIndex];
                return `Semana ${week.weekNumber} (${week.monthName})`;
              }
            }
          },
          // Annotations for month changes - this requires chartjs-plugin-annotation
          // For simplicity, I'll omit this for now and add it if needed, as it requires an additional plugin.
          // If the user wants vertical lines, I'll need to install and configure 'chartjs-plugin-annotation'.
        },
        scales: {
          x: {
            display: false, // Hide x-axis
            stacked: true,
          },
          y: {
            stacked: true,
            grid: {
              display: false, // Hide y-axis grid lines
            },
            ticks: {
              callback: function(value, index, ticks) {
                const week = epiWeeks[index];
                return `Semana ${week.weekNumber}`;
              },
              font: {
                size: 10, // Adjust font size for readability
              }
            },
          },
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        }
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-ia-card p-6 rounded-lg shadow-md transition-colors duration-500" style={{ width: '100%', height: '800px' }}>
      <h2 className="text-xl font-semibold text-ia-text mb-4">Calendario de Semanas Epidemiológicas 2025</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default EpiWeekCalendarChart;
