import React from "react";
import MapaMultiNodo from "../components/MapaMultiNodo";

export default function PaginaMapaCalor() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Mapa de Calor - Niveles de CO2</h1>
      </div>
      
      {/* Descripción */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <p className="text-gray-300">
          Este mapa muestra la distribución espacial de los niveles de CO2 en diferentes ubicaciones. 
          Las zonas rojas indican niveles más altos de CO2, mientras que las zonas azules indican niveles más bajos.
          Puedes alternar entre la vista de mapa de calor y marcadores utilizando el control en la esquina superior derecha.
        </p>
      </div>

      {/* Mapa */}
      <MapaMultiNodo />
    </div>
  );
}
