// src/components/vistaTablero.jsx
import React, { useState } from "react";
import IndicadorGauge from "./indicadorGauge";
import UbicacionFromCoordenadas from "./ubicacióndeCoordenadas";
import GraficoTempHumedad from "./graficoTempHumedad";
import VistaMapa from "./vistaMapa";
import TablaLecturas from "./tablaLecturas";
import HistorialAlertas from "./historialAlertas";
import WidgetTableroSemanaEpi from "./widgetTableroSemanaEpi";
import { useObtenerLecturas } from "../use/useObtenerLecturas";
import { useObtenerHistorialAlertas } from "../use/useObtenerHistorialAlertas";
import ComponenteDeAlertas from "./ComponenteDeAlertas";

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
        <ComponenteDeAlertas />
      </div>

      <div className="mb-4">
  <WidgetTableroSemanaEpi />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fila 1: Lecturas Actuales con Medidores */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <IndicadorGauge />
        </div>

        {/* Fila 2: Lecturas Recientes con estilo de tabla */}
  <div className="bg-[#232b36] p-6 rounded-2xl shadow-2xl w-full border border-[#232b36] md:col-span-2">
          <h2 className="text-white text-2xl font-bold tracking-wide mb-4">Lecturas Recientes</h2>
          <div className="overflow-auto rounded-xl border border-[#232b36] bg-[#232b36]">
            <table className="min-w-full text-sm text-gray-100">
              <thead className="text-xs bg-[#232b36] border-b border-[#232b36] sticky top-0 z-10">
                <tr className="bg-[#232b36] border-b border-[#232b36]">
                  <th className="px-5 py-4 text-left text-white font-semibold">Fecha</th>
                  <th className="px-5 py-4 text-left text-white font-semibold">Hora</th>
                  <th className="px-5 py-4 text-left text-white font-semibold">ID de Nodo</th>
                  <th className="px-5 py-4 text-left text-[#ff9100] font-semibold">Temperatura</th>
                  <th className="px-5 py-4 text-left text-[#43a047] font-semibold">Humedad</th>
                  <th className="px-5 py-4 text-left text-[#2196f3] font-semibold">CO₂</th>
                  <th className="px-5 py-4 text-left text-[#f44336] font-semibold">Bioacústica</th>
                  <th className="px-5 py-4 text-left text-white font-semibold">Latitud</th>
                  <th className="px-5 py-4 text-left text-white font-semibold">Longitud</th>
                  <th className="px-5 py-4 text-left text-gray-300 font-semibold">Ciudad</th>
                </tr>
              </thead>
              <tbody>
                {[...(data || [])].slice(-5).reverse().map((lectura, idx) => (
                  <tr
                    key={idx}
                    className="text-center border-b border-gray-800 bg-[#1a2232] hover:bg-[#232b36] transition duration-150"
                  >
                    <td className="px-5 py-3 whitespace-nowrap text-white font-bold">{new Date(lectura.fecha).toLocaleDateString('es-CR', { timeZone: 'UTC' })}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-white font-bold">{new Date(lectura.fecha).toLocaleTimeString('es-CR', { timeZone: 'UTC' })}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-white font-bold">{lectura.nodo_id}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-[#ff9100] font-bold">{lectura.temperatura} °C</td>
                    <td className="px-5 py-3 whitespace-nowrap text-[#43a047] font-bold">{lectura.humedad} %</td>
                    <td className="px-5 py-3 whitespace-nowrap text-[#2196f3] font-bold">{lectura.co2} ppm</td>
                    <td className="px-5 py-3 whitespace-nowrap text-[#f44336] font-bold">{lectura.acustica} Hz</td>
                    <td className="px-5 py-3 whitespace-nowrap text-white font-bold">{lectura.latitud !== undefined ? Number(lectura.latitud).toFixed(5) : 'N/A'}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-white font-bold">{lectura.longitud !== undefined ? Number(lectura.longitud).toFixed(5) : 'N/A'}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-gray-300"><UbicacionFromCoordenadas lat={lectura.latitud} lon={lectura.longitud} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fila 3: Mapa */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <VistaMapa coordenadas={coordenadasSensor} />
        </div>
        
        {/* Fila 4: Gráfica */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <div className="flex justify-end mb-4">
            <div className="relative inline-block w-[140px]">
              <select
                value={chartMode}
                onChange={(e) => setChartMode(e.target.value)}
                className="appearance-none border border-cyan-500 rounded-lg px-3 py-2 pr-8 bg-gray-800 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow cursor-pointer transition duration-150 w-full"
              >
                <option value="line">Líneas</option>
                <option value="bar">Barras</option>
                <option value="area">Área</option>
              </select>
              <span className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </div>
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