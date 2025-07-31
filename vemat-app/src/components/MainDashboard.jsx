// src/components/MainDashboard.jsx
import React from "react";
import CurrentReadings from "./CurrentReadings";
import TempHumidityChart from "./TempHumidityChart";
import MapView from "./MapView";
import ReadingsTable from "./ReadingsTable";
import AlertHistory from "./AlertHistory";
import { useDashboardData } from "../context/DashboardContext";
import { sendTestEmail } from "../utils/testEmail";

export default function MainDashboard() {
  const { latest, data, alertHistory } = useDashboardData();

  const coordenadasSensor = {
    lat: latest.latitude || 10.43079,
    lng: latest.longitude || -85.08499,
  };

  const handleTestEmail = async () => {
    try {
      const result = await sendTestEmail();
      alert(result.status === 200 ? 
        'Correo de prueba enviado exitosamente' : 
        'Error al enviar el correo de prueba');
    } catch (error) {
      console.error('Error detallado:', error);
      alert(`Error al enviar el correo: ${error.message}`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Panel Principal de Control</h1>
        <button 
          onClick={handleTestEmail}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
        >
          <span className="mr-2">📧</span>
          Probar Envío de Correo
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primera fila */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <CurrentReadings lectura={latest} />
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <MapView coordenadas={coordenadasSensor} />
        </div>
        
        {/* Segunda fila */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <TempHumidityChart datos={data} />
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <ReadingsTable historial={data} />
        </div>

        {/* Tercera fila - Historial de Alertas (ocupa todo el ancho) */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:col-span-2">
          <AlertHistory alertas={alertHistory} />
        </div>
      </div>
    </div>
  );
}
