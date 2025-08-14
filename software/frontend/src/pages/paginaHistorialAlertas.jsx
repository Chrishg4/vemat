// src/pages/paginaHistorialAlertas.jsx
import React from "react";
import HistorialAlertas from "../components/historialAlertas";
import { useObtenerHistorialAlertas } from "../use/useObtenerHistorialAlertas";

export default function PaginaHistorialAlertas() {
  const { alertHistory, loading, error } = useObtenerHistorialAlertas();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Historial de Alertas</h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
  <HistorialAlertas alertas={alertHistory} />
      </div>

      {/* Estadísticas de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">Total de Alertas</h3>
          <p className="text-3xl font-bold text-white">{alertHistory.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-2">Alertas Enviadas</h3>
          <p className="text-3xl font-bold text-white">
            {alertHistory.filter(alert => alert.estado === 'enviado').length}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Alertas con Error</h3>
          <p className="text-3xl font-bold text-white">
            {alertHistory.filter(alert => alert.estado === 'error').length}
          </p>
        </div>
      </div>
    </div>
  );
}
