import React from 'react';
import MapaMultiNodo from '../components/MapaMultiNodo';
import VistaMapa from '../components/vistaMapa';
import { useContextoTablero } from "../context/contextoTablero";

export default function PaginaMapasCombinados() {
  const { latest } = useContextoTablero();

  const coordenadasSensor = {
    lat: latest.latitude || 10.43079,
    lng: latest.longitude || -85.08499,
  };

  return (
    <div className="p-6 text-ia-text space-y-6">
      <h1 className="text-2xl font-bold">Mapas Combinados</h1>

      {/* Mapa de Calor de Alertas */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">Mapa de Calor de Alertas</h2>
        <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border transition-colors duration-500 hover:shadow-xl">
          <MapaMultiNodo />
        </div>
      </div>

      {/* Ubicación del Sensor Principal */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">Ubicación del Sensor Principal</h2>
        <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border transition-colors duration-500 hover:shadow-xl">
          <VistaMapa coordenadas={coordenadasSensor} />
        </div>
      </div>
    </div>
  );
}