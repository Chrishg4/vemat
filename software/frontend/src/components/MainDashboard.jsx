// src/components/MainDashboard.jsx
import React from "react";
import CurrentReadings from "./CurrentReadings";
import TempHumidityChart from "./TempHumidityChart";
import MapView from "./MapView";
import ReadingsTable from "./ReadingsTable";
import AlertHistory from "./AlertHistory";
import { useGetReadings } from "../use/useGetReadings";
import { useGetAlertHistory } from "../use/useGetAlertHistory";

export default function MainDashboard() {
  const { latest, data } = useGetReadings();
  const { alertHistory } = useGetAlertHistory();

  const coordenadasSensor = {
    lat: latest.latitude || 10.43079,
    lng: latest.longitude || -85.08499,
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Panel Principal de Control</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fila 1: Lecturas Actuales y Historial de Lecturas */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <CurrentReadings lectura={latest} />
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <ReadingsTable historial={data} />
        </div>

        {/* Fila 2: Mapa */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <MapView coordenadas={coordenadasSensor} />
        </div>
        
        {/* Fila 3: Gráfica */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <TempHumidityChart />
        </div>

        {/* Fila 4: Historial de Alertas */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <AlertHistory alertas={alertHistory} />
        </div>
      </div>
    </div>
  );
}