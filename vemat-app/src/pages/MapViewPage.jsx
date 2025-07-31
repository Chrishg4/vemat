// src/pages/MapViewPage.jsx
import React, { useContext } from 'react';
import MapView from '../components/MapView'; // Asegúrate de que esta ruta sea correcta
import { DashboardDataContext } from '../components/Dashboard'; // Importa el contexto

export default function MapViewPage() {
  const { deviceLocation } = useContext(DashboardDataContext); // Obtiene los datos del contexto

  if (!deviceLocation) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Mapa de Ubicación del Dispositivo</h2>
      <MapView latitude={deviceLocation.latitude} longitude={deviceLocation.longitude} /> {/* Pasa los datos como prop */}
    </div>
  );
}