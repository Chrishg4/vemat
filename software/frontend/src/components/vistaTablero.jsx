// src/components/vistaTablero.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import IndicadorGauge from "./indicadorGauge";
import UbicacionFromCoordenadas from "./ubicacióndeCoordenadas";
import GraficoTempHumedad from "./graficoTempHumedad";
import GraficoBioacustica from "./graficoBioacustica";
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-ia-text">Panel Principal de Control</h1>
      </div>

      <div className="mb-4">
        <ComponenteDeAlertas />
      </div>

      <div className="mb-4">
        <WidgetTableroSemanaEpi />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fila 1: Lecturas Actuales con Medidores */}
        <div className="bg-ia-card p-4 rounded-xl shadow-lg md:col-span-2">
          <IndicadorGauge />
        </div>

        {/* Fila 2: Lecturas Recientes con estilo de tabla */}
        <div className="bg-ia-card p-6 rounded-2xl shadow-2xl w-full border border-ia-border md:col-span-2">
          <h2 className="text-ia-text text-2xl font-bold tracking-wide mb-4">Lecturas Recientes</h2>
          <ResponsiveTable
            columns={lecturasRecientesColumns}
            data={[...(data || [])].slice(-5).reverse()}
            loading={lecturasLoading}
            noDataMessage="No hay lecturas recientes"
            containerClassName="overflow-auto rounded-xl border border-ia-border bg-ia-card"
          />
        </div>

        {/* Fila 3: Mapa */}
        <div className="bg-ia-card p-4 rounded-xl shadow-lg md:col-span-2">
          <VistaMapa coordenadas={coordenadasSensor} />
        </div>
        
        {/* Fila 4: Gráfica */}
        <div className="bg-ia-card p-4 rounded-xl shadow-lg md:col-span-2">
          <div className="flex justify-end mb-4">
            <div className="relative inline-block w-[140px]">
              <select
                value={chartMode}
                onChange={(e) => setChartMode(e.target.value)}
                className="appearance-none border border-ia-border rounded-lg px-3 py-2 pr-8 bg-ia-card text-ia-text font-semibold focus:outline-none focus:ring-2 focus:ring-ia-accent shadow cursor-pointer transition duration-150 w-full"
              >
                <option value="line">Líneas</option>
                <option value="bar">Barras</option>
                <option value="area">Área</option>
              </select>
              <span className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-ia-text">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </div>
          </div>
          <GraficoTempHumedad chartMode={chartMode} />
        </div>

        {/* Fila 5: Historial de Alertas */}
        <div className="bg-ia-card p-4 rounded-xl shadow-lg md:col-span-2">
          {error && (
            <AlertaEnhanced
              mensaje={error.message || "Ocurrió un error al cargar el historial de alertas."}
              severity="alta"
            />
          )}
          <HistorialAlertas alertas={alertHistory} loading={loading} />
        </div>
      </div>
    </div>
  );
}