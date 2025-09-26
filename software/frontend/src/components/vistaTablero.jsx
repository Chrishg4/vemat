// src/components/vistaTablero.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import IndicadorGauge from "./indicadorGauge";
import UbicacionFromCoordenadas from "./ubicacióndeCoordenadas";
import GraficoTempHumedad from "./graficoTempHumedad";
import GraficoBioacustica from "./graficoBioacustica";
import MosquitoAnalysis from "./mosquitoAnalysis";
import VistaMapa from "./vistaMapa";
import TablaLecturas from "./tablaLecturas";
import HistorialAlertas from "./historialAlertas";
import WidgetTableroSemanaEpi from "./widgetTableroSemanaEpi";
import { useObtenerLecturas } from "../use/useObtenerLecturas";
import { useObtenerHistorialAlertas } from "../use/useObtenerHistorialAlertas";
import ComponenteDeAlertas from "./ComponenteDeAlertas";
import AlertaEnhanced from "./AlertaEnhanced";
import ResponsiveTable from "./ResponsiveTable";

export default function VistaTablero() {
  const { latest, data, loading: lecturasLoading } = useObtenerLecturas();
  const { alertHistory, loading, error } = useObtenerHistorialAlertas();
  const [chartMode, setChartMode] = useState('line'); // Estado para el modo del gráfico
  const { theme } = useTheme();

  const lecturasRecientesColumns = [
    {
      header: 'Fecha',
      render: (lectura) => new Date(lectura.fecha).toLocaleDateString('es-CR', { timeZone: 'UTC' })
    },
    {
      header: 'Hora',
      render: (lectura) => new Date(lectura.fecha).toLocaleTimeString('es-CR', { timeZone: 'UTC' })
    },
    { header: 'ID de Nodo', field: 'nodo_id' },
    {
      header: 'Temperatura',
      render: (lectura) => <span className="text-ia-warning font-bold">{lectura.temperatura} °C</span>
    },
    {
      header: 'Humedad',
      render: (lectura) => <span className="text-ia-success font-bold">{lectura.humedad} %</span>
    },
    {
      header: 'CO₂',
      render: (lectura) => <span className="text-ia-info font-bold">{lectura.co2} ppm</span>
    },
    {
      header: 'Bioacústica',
      render: (lectura) => <span className="text-ia-error font-bold">{lectura.acustica} Hz</span>
    },
    {
      header: 'Latitud',
      render: (lectura) => (lectura.latitud !== undefined ? Number(lectura.latitud).toFixed(5) : 'N/A')
    },
    {
      header: 'Longitud',
      render: (lectura) => (lectura.longitud !== undefined ? Number(lectura.longitud).toFixed(5) : 'N/A')
    },
    {
      header: 'Ciudad',
      render: (lectura) => <UbicacionFromCoordenadas lat={lectura.latitud} lon={lectura.longitud} />
    }
  ];

  const coordenadasSensor = {
    lat: latest.latitude || 10.43079,
    lng: latest.longitude || -85.08499,
  };

  const [activeTab, setActiveTab] = useState('dashboard');

  // Renderizado condicional basado en la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Indicadores principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <IndicadorGauge />
            </div>

            {/* Widgets de resumen semanal */}
            <div className="grid grid-cols-1 gap-6">
              <WidgetTableroSemanaEpi />
            </div>

            {/* Gráficos y mapa */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de temperatura y humedad */}
              <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-ia-text">Temperatura y Humedad</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setChartMode('line')}
                      className={`px-3 py-1 rounded-lg ${chartMode === 'line' ? 'bg-ia-accent text-white' : 'bg-ia-background text-ia-text-secondary'}`}
                    >
                      Línea
                    </button>
                    <button
                      onClick={() => setChartMode('area')}
                      className={`px-3 py-1 rounded-lg ${chartMode === 'area' ? 'bg-ia-accent text-white' : 'bg-ia-background text-ia-text-secondary'}`}
                    >
                      Área
                    </button>
                    <button
                      onClick={() => setChartMode('bar')}
                      className={`px-3 py-1 rounded-lg ${chartMode === 'bar' ? 'bg-ia-accent text-white' : 'bg-ia-background text-ia-text-secondary'}`}
                    >
                      Barra
                    </button>
                  </div>
                </div>
                <GraficoTempHumedad chartMode={chartMode} />
              </div>

              {/* Mapa de ubicación */}
              <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
                <h2 className="text-xl font-semibold text-ia-text mb-4">Ubicación del Dispositivo</h2>
                <div className="h-[320px] rounded-lg overflow-hidden">
                  <VistaMapa coordenadas={coordenadasSensor} />
                </div>
                {latest && latest.latitude && latest.longitude && (
                  <div className="mt-2 text-sm text-ia-text-secondary">
                    <UbicacionFromCoordenadas lat={latest.latitude} lon={latest.longitude} />
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico de bioacústica y alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de bioacústica */}
              <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
                <h2 className="text-xl font-semibold text-ia-text mb-4">Bioacústica</h2>
                <GraficoBioacustica data={data} showAnalysis={true} />
              </div>

              {/* Alertas recientes */}
              <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
                <h2 className="text-xl font-semibold text-ia-text mb-4">Alertas Recientes</h2>
                <HistorialAlertas alertas={alertHistory} loading={loading} limit={5} />
              </div>
            </div>

            {/* Análisis de mosquitos */}
            <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
              <MosquitoAnalysis />
            </div>

            {/* Tabla de lecturas recientes */}
            <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500">
              <h2 className="text-xl font-semibold text-ia-text mb-4">Lecturas Recientes</h2>
              <ResponsiveTable 
                columns={lecturasRecientesColumns}
                data={[...(data || [])].slice(-5).reverse()}
                loading={lecturasLoading}
                noDataMessage="No hay lecturas recientes"
                containerClassName="overflow-auto rounded-xl border border-ia-border bg-ia-card"
              />
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500">
            <h2 className="text-xl font-semibold text-ia-text mb-4">Mapa de Dispositivos</h2>
            <div className="h-[600px] rounded-lg overflow-hidden">
              <VistaMapa coordenadas={coordenadasSensor} />
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500">
            <h2 className="text-xl font-semibold text-ia-text mb-4">Lecturas Recientes</h2>
            <ResponsiveTable 
              columns={lecturasRecientesColumns}
              data={data || []}
              loading={lecturasLoading}
              noDataMessage="No hay lecturas disponibles"
              containerClassName="overflow-auto rounded-xl border border-ia-border bg-ia-card"
            />
          </div>
        );
      case 'alerts':
        return (
          <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500">
            <h2 className="text-xl font-semibold text-ia-text mb-4">Historial de Alertas</h2>
            <HistorialAlertas alertas={alertHistory} loading={loading} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ia-text">Panel Principal de Control</h1>
        <div className="flex space-x-2 bg-ia-background rounded-lg p-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-ia-accent text-white shadow-md' : 'text-ia-text-secondary hover:bg-ia-border/30'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'map' ? 'bg-ia-accent text-white shadow-md' : 'text-ia-text-secondary hover:bg-ia-border/30'}`}
          >
            Mapa
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'data' ? 'bg-ia-accent text-white shadow-md' : 'text-ia-text-secondary hover:bg-ia-border/30'}`}
          >
            Datos
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'alerts' ? 'bg-ia-accent text-white shadow-md' : 'text-ia-text-secondary hover:bg-ia-border/30'}`}
          >
            Alertas
          </button>
        </div>
      </div>

      <div className="mb-4">
        <ComponenteDeAlertas />
      </div>

      {renderContent()}
    </div>
  );
}