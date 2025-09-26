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
      header: "Fecha",
      render: (alerta) => (
        <span className="text-blue-400">
          {new Date(alerta.fecha).toLocaleDateString('es-CR')}
        </span>
      ),
    },
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
    <>
      <ResponsiveTable
        columns={columns}
        data={[...alertas].reverse()}
        loading={loading}
        noDataMessage="No hay alertas registradas"
        containerClassName="overflow-x-auto"
      />
    </>
  );
}
