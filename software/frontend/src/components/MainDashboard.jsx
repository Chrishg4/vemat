// src/components/MainDashboard.jsx
import React, { useState } from "react";
import GaugeDisplay from "./GaugeDisplay"; // Reemplaza a CurrentReadings
import TempHumidityChart from "./TempHumidityChart";
import MapView from "./MapView";
import ReadingsTable from "./ReadingsTable";
import AlertHistory from "./AlertHistory";
import EpiWeekDashboardWidget from "./EpiWeekDashboardWidget";
import { useGetReadings } from "../use/useGetReadings";
import { useGetAlertHistory } from "../use/useGetAlertHistory";

export default function MainDashboard() {
  const { latest, data } = useGetReadings();
  const { alertHistory } = useGetAlertHistory();
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
        <EpiWeekDashboardWidget />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fila 1: Lecturas Actuales con Medidores */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <GaugeDisplay />
        </div>

        {/* Fila 2: Historial de Lecturas */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <ReadingsTable limit={5} showTitle={true} title="Lecturas Recientes" />
        </div>

        {/* Fila 3: Mapa */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <MapView coordenadas={coordenadasSensor} />
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
            </select>
          </div>
          <TempHumidityChart chartMode={chartMode} />
        </div>

        {/* Fila 5: Historial de Alertas */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <AlertHistory alertas={alertHistory} />
        </div>
      </div>
    </div>
  );
}