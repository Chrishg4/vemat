import React from "react";
import { useContextoTablero } from "../context/contextoTablero";
import { getEpiWeek } from "../utils/epiWeek";
import ResponsiveTable from "./ResponsiveTable";

export default function EpiWeekTable() {
  const { data, loading } = useContextoTablero();

  const groupedData = data.reduce((acc, item) => {
    const epiWeek = getEpiWeek(item.fecha);
    const weekKey = `${epiWeek.year}-${String(epiWeek.week).padStart(2, '0')}`;

    if (!acc[weekKey]) {
      acc[weekKey] = {
        totalTemp: 0,
        totalHum: 0,
        totalCo2: 0,
        totalSound: 0,
        count: 0,
        name: `SE ${epiWeek.week}/${epiWeek.year}`,
      };
    }
    acc[weekKey].totalTemp += parseFloat(item.temperatura);
    acc[weekKey].totalHum += parseFloat(item.humedad);
    acc[weekKey].totalCo2 += parseFloat(item.co2);
    acc[weekKey].totalSound += parseFloat(item.acustica);
    acc[weekKey].count += 1;
    return acc;
  }, {});

  const tableData = Object.values(groupedData).map((week) => ({
    name: week.name,
    avgTemp: (week.totalTemp / week.count).toFixed(2),
    avgHum: (week.totalHum / week.count).toFixed(2),
    avgCo2: (week.totalCo2 / week.count).toFixed(2),
    avgSound: (week.totalSound / week.count).toFixed(2),
  })).sort((a, b) => a.name.localeCompare(b.name));

  const columns = [
    { header: 'Semana Epidemiológica', field: 'name' },
    { header: 'Temp. Promedio (°C)', field: 'avgTemp' },
    { header: 'Hum. Promedio (%)', field: 'avgHum' },
    { header: 'CO₂ Promedio (ppm)', field: 'avgCo2' },
    { header: 'Bioacustica Promedio (Hz)', field: 'avgSound' }
  ];

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-full">
      <h2 className="text-white text-xl font-semibold mb-4">
        Datos Agregados por Semana Epidemiológica
      </h2>
      <div className="overflow-auto max-h-[400px] no-scrollbar">
        <ResponsiveTable
          columns={columns}
          data={tableData}
          loading={loading}
          noDataMessage="No hay datos de semana epidemiológica para mostrar"
        />
      </div>
    </div>
  );
}