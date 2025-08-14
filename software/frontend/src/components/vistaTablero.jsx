// src/components/vistaTablero.jsx
import React, { useState } from "react";
import IndicadorGauge from "./indicadorGauge";
import GraficoTempHumedad from "./graficoTempHumedad";
import VistaMapa from "./vistaMapa";
import TablaLecturas from "./tablaLecturas";
import HistorialAlertas from "./historialAlertas";
import WidgetTableroSemanaEpi from "./widgetTableroSemanaEpi";
import { useObtenerLecturas } from "../use/useObtenerLecturas";
import { useObtenerHistorialAlertas } from "../use/useObtenerHistorialAlertas";

export default function VistaTablero() {
  const { latest, data } = useObtenerLecturas();
  const { alertHistory } = useObtenerHistorialAlertas();
  const [chartMode, setChartMode] = useState('line'); // Estado para el modo del gráfico

  const coordenadasSensor = {
    lat: latest.latitude || 10.43079,
    lng: latest.longitude || -85.08499,
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Panel Principal de Control</h1>
      </div>

      <div className="mb-4">
  <WidgetTableroSemanaEpi />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fila 1: Lecturas Actuales con Medidores */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <IndicadorGauge />
        </div>

        {/* Fila 2: Lecturas Recientes (solo últimas 5, sin tabla paginada) */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <h2 className="text-white text-xl font-semibold mb-4">Lecturas Recientes</h2>
          <ul className="divide-y divide-gray-700">
            {[...(data || [])].slice(-5).reverse().map((lectura, idx) => (
              <li key={idx} className="py-2 flex flex-wrap justify-between items-center">
                <span className="text-gray-300 text-sm font-medium mr-2">{new Date(lectura.fecha).toLocaleString('es-CR', { timeZone: 'UTC' })}</span>
                <span className="text-cyan-400 text-sm mr-2">Nodo: {lectura.nodo_id}</span>
                <span className="text-gray-300 text-sm mr-2">Temp: {lectura.temperatura} °C</span>
                <span className="text-gray-300 text-sm mr-2">Hum: {lectura.humedad} %</span>
                <span className="text-gray-300 text-sm mr-2">CO₂: {lectura.co2} ppm</span>
                <span className="text-gray-300 text-sm mr-2">Bioacústica: {lectura.acustica} Hz</span>
                <span className="text-gray-300 text-sm">Ciudad: Cañas</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Fila 3: Mapa */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <VistaMapa coordenadas={coordenadasSensor} />
        </div>
        
        {/* Fila 4: Gráfica */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <div className="flex justify-end mb-4">
            <select
              value={chartMode}
              onChange={(e) => setChartMode(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="line">Líneas</option>
              <option value="bar">Barras</option>
              <option value="area">Área</option>
            </select>
          </div>
          <GraficoTempHumedad chartMode={chartMode} />
        </div>

        {/* Fila 5: Historial de Alertas */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <HistorialAlertas alertas={alertHistory} />
        </div>
      </div>
    </div>
  );
}