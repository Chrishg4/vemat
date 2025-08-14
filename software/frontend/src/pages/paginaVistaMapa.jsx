// src/pages/paginaVistaMapa.jsx
import React, { useContext } from 'react';
import VistaMapa from '../components/vistaMapa';
import { ContextoTableroDatos } from '../components/tableroPrincipal';

export default function PaginaVistaMapa() {
  const { deviceLocation } = useContext(DashboardDataContext); // Obtiene los datos del contexto

  if (!deviceLocation) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Mapa de Ubicación del Dispositivo</h2>
  <VistaMapa latitude={deviceLocation.latitude} longitude={deviceLocation.longitude} /> {/* Pasa los datos como prop */}
    </div>
  );
}