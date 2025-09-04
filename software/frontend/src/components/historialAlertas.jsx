// src/components/historialAlertas.jsx
import React from "react";
import UbicacionFromCoordenadas from "./ubicacióndeCoordenadas";
import ResponsiveTable from "./ResponsiveTable";

export default function HistorialAlertas({ alertas, loading }) {
  const columns = [
    {
      header: "Tipo",
      render: (alerta) => <span className="text-blue-400">{alerta.tipo}</span>,
    },
    {
      header: "Valor",
      render: (alerta) => (
        <span className="text-blue-400">
          {alerta.valor}
          {alerta.tipo === "temperatura"
            ? "°C"
            : alerta.tipo === "humedad"
            ? "%"
            : alerta.tipo === "co2"
            ? " ppm"
            : ""}
        </span>
      ),
    },
    { header: "Rango Normal", field: "rangoNormal" },
    {
      header: "Estado",
      render: (alerta) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            alerta.estado === "enviado"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {alerta.estado}
        </span>
      ),
    },
    {
      header: "Coordenadas",
      render: (alerta) =>
        alerta.latitud && alerta.longitud
          ? `${alerta.latitud.toFixed(5)}, ${alerta.longitud.toFixed(5)}`
          : "N/A",
    },
    {
      header: "Ubicación",
      render: (alerta) => (
        <UbicacionFromCoordenadas
          lat={alerta.latitud}
          lon={alerta.longitud}
        />
      ),
    },
  ];

  return (
    <div className="bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border">
      <h2 className="text-xl font-semibold mb-4 text-ia-text">
        Historial de Alertas
      </h2>
      <ResponsiveTable
        columns={columns}
        data={[...alertas].reverse()}
        loading={loading}
        noDataMessage="No hay alertas registradas"
        containerClassName="overflow-x-auto"
      />
    </div>
  );
}
