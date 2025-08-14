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

    const monthColors = [
      'rgba(255, 99, 132, 0.5)', // Enero (Red)
      'rgba(54, 162, 235, 0.5)', // Febrero (Blue)
      'rgba(255, 206, 86, 0.5)', // Marzo (Yellow)
      'rgba(75, 192, 192, 0.5)', // Abril (Green)
      'rgba(153, 102, 255, 0.5)', // Mayo (Purple)
      'rgba(255, 159, 64, 0.5)', // Junio (Orange)
      'rgba(199, 199, 199, 0.5)', // Julio (Grey)
      'rgba(83, 102, 255, 0.5)', // Agosto (Indigo)
      'rgba(255, 99, 71, 0.5)', // Septiembre (Tomato)
      'rgba(60, 179, 113, 0.5)', // Octubre (MediumSeaGreen)
      'rgba(218, 112, 214, 0.5)', // Noviembre (Orchid)
      'rgba(100, 149, 237, 0.5)', // Diciembre (CornflowerBlue)
    ];

    const backgroundColors = epiWeeks.map(week => {
      if (week.weekNumber === 1 || week.weekNumber === 52) {
        return 'rgba(255, 0, 0, 0.7)'; // Highlight Week 1 and 52 in red
      }
      return monthColors[week.month];
    });

    const borderColors = epiWeeks.map(week => {
      if (week.weekNumber === 1 || week.weekNumber === 52) {
        return 'rgba(255, 0, 0, 1)';
      }
      return monthColors[week.month].replace('0.5', '1');
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
    <div style={{ width: '100%', height: '800px' }}> {/* Adjust height as needed */}
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default EpiWeekCalendarChart;
