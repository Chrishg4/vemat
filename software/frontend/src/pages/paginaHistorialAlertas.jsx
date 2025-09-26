// src/pages/paginaHistorialAlertas.jsx
import React from "react";
import HistorialAlertas from "../components/historialAlertas";
import { useObtenerHistorialAlertas } from "../use/useObtenerHistorialAlertas";
import AlertaEnhanced from "../components/AlertaEnhanced";

export default function PaginaHistorialAlertas() {
  const { alertHistory, loading, error } = useObtenerHistorialAlertas();

  return (
    <div className="p-6 text-ia-text space-y-6">
      <h1 className="text-2xl font-bold">Historial de Alertas</h1>
      
      {error && (
        <AlertaEnhanced
          mensaje={error.message || "Ocurrió un error al cargar el historial de alertas."}
          severity="alta"
        />
      )}

      <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border">
        <HistorialAlertas alertas={alertHistory} loading={loading} />
      </div>

      {/* Estadísticas de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border">
          <h3 className="text-lg font-semibold text-ia-accent mb-2">Total de Alertas</h3>
          <p className="text-3xl font-bold text-ia-text">{alertHistory.length}</p>
        </div>
        <div className="bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border">
          <h3 className="text-lg font-semibold text-green-400 mb-2">Alertas Enviadas</h3>
          <p className="text-3xl font-bold text-ia-text">
            {alertHistory.filter(alert => alert.estado === 'enviado').length}
          </p>
        </div>
        <div className="bg-ia-card p-4 rounded-xl shadow-lg border border-ia-border">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Alertas con Error</h3>
          <p className="text-3xl font-bold text-ia-text">
            {alertHistory.filter(alert => alert.estado === 'error').length}
          </p>
        </div>
      </div>
    </div>
  );
}
