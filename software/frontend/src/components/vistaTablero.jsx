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
import AnalisisBioacustica from "./AnalisisBioacustica";
import DownloadMosquitoData from './DownloadMosquitoData'; // Import the download component

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
            <div className="grid grid-cols-1 gap-4">
              <IndicadorGauge />
            </div>

            {/* Widgets de resumen semanal */}
            <div className="grid grid-cols-1 gap-6">
              <WidgetTableroSemanaEpi />
            </div>

            {/* Gráficos y mapa */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de temperatura y humedad */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-ia-text">Grafica de Datos</h2>
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
                <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
                    <GraficoTempHumedad chartMode={chartMode} />
                </div>
              </div>

              {/* Mapa de ubicación */}
              <div>
                <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
                    <div className="h-[320px] rounded-lg overflow-hidden">
                        <VistaMapa coordenadas={coordenadasSensor} />
                    </div>
                </div>
                {latest && latest.latitude && latest.longitude && (
                    <div className="mt-4 text-sm text-ia-text-secondary">
                        <p className="font-semibold text-ia-text mb-1">Ubicación del Sensor</p>
                        <UbicacionFromCoordenadas lat={latest.latitude} lon={latest.longitude} />
                    </div>
                )}
              </div>
            </div>

            {/* Gráfico de bioacústica */}
            <div>
              <h2 className="text-xl font-semibold text-ia-text mb-4">Bioacústica</h2>
              <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
                <GraficoBioacustica data={data} />
              </div>
            </div>

            {/* Análisis de Bioacústica */}
            <AnalisisBioacustica />

            {/* Historial de Alertas */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-ia-text">Historial de Alertas</h2>
                    <DownloadMosquitoData fields={['tipo','fecha','estado','latitud','longitud']} />
                </div>
                <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500 hover:shadow-xl">
                    <HistorialAlertas alertas={alertHistory} loading={loading} limit={5} />
                </div>
            </div>

            {/* Análisis de mosquitos */}
            <MosquitoAnalysis />

            {/* Tabla de lecturas recientes */}
            <div>
              <h2 className="text-xl font-semibold text-ia-text mb-4">Lecturas Recientes</h2>
              <div className="bg-ia-card rounded-xl shadow-lg border border-ia-border p-4 transition-colors duration-500">
                <ResponsiveTable 
                  columns={lecturasRecientesColumns}
                  data={[...(data || [])].slice(-5).reverse()}
                  loading={lecturasLoading}
                  noDataMessage="No hay lecturas recientes"
                  containerClassName="overflow-auto"
                />
              </div>
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