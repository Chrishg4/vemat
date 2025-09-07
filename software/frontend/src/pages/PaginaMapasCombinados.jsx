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
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-ia-text mb-4">Mapa de Calor de Alertas</h2>
        <MapaMultiNodo />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-ia-text mb-4">Ubicación del Sensor Principal</h2>
        <VistaMapa coordenadas={coordenadasSensor} />
      </div>
    </div>
  );
}
