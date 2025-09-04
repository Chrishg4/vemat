import React from "react";
import ResponsiveTable from "./ResponsiveTable";

export default function HistoryTable({ historial, loading }) {
  const columns = [
    { header: 'Fecha', field: 'fecha' },
    { header: 'Ciudad', field: 'ciudad' },
    { header: 'Temperatura (°C)', field: 'temperatura' },
    { header: 'Humedad (%)', field: 'humedad' },
    { header: 'CO₂ (ppm)', field: 'co2' }
  ];

  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <ResponsiveTable
        columns={columns}
        data={[...historial].reverse()}
        loading={loading}
        noDataMessage="No hay historial para mostrar"
      />
    </div>
  );
}
