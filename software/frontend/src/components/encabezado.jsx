import React from "react";
import { GiAmberMosquito } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import { useContextoTablero } from "../context/contextoTablero";

export default function Encabezado() {
  const { hasNewData, refreshData, data, loading } = useContextoTablero();
  
  const handleRefresh = () => {
    refreshData();
  };
  
  // Solo mostrar el indicador de nuevos datos si:
  // 1. hasNewData es true
  // 2. Ya tenemos datos cargados (data.length > 0)
  // 3. No estamos en proceso de carga inicial (loading es false)
  const mostrarIndicadorNuevosDatos = hasNewData && data.length > 0 && !loading;
  
  return (
    <header className="bg-gray-800 text-white py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <span className="text-sm font-semibold text-gray-300 whitespace-nowrap mr-4">
          Universidad Tecnica Nacional - Sede Guanacaste
        </span>
        
        <h1 className="text-xl font-bold flex-1 text-center mx-auto flex items-center justify-center">
          <GiAmberMosquito className="mr-2 text-yellow-400 text-2xl" />
          Sistema de Vigilancia Eco-epidemiológico de Mosquitos
        </h1>
        
        <div className="w-48 flex justify-end items-center">
          {mostrarIndicadorNuevosDatos && (
            <button 
              onClick={handleRefresh}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-all animate-pulse"
              title="Hay nuevos datos disponibles. Haz clic para actualizar."
            >
              <FaBell className="mr-1" />
              Actualizar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
