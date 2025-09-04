import React from "react";
import { GiAmberMosquito } from "react-icons/gi";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useContextoTablero } from "../context/contextoTablero";
import { useTheme } from "../context/ThemeContext";

export default function Encabezado() {
  const { hasNewData, refreshData, data, loading } = useContextoTablero();
  const { theme, toggleTheme } = useTheme();
  
  const handleRefresh = () => {
    refreshData();
  };
  
  // Solo mostrar el indicador de nuevos datos si:
  // 1. hasNewData es true
  // 2. Ya tenemos datos cargados (data.length > 0)
  // 3. No estamos en proceso de carga inicial (loading es false)
  const mostrarIndicadorNuevosDatos = hasNewData && data.length > 0 && !loading;
  
  return (
    <header className="bg-ia-card shadow-lg py-3 transition-colors duration-500">
      <div className="container mx-auto flex justify-between items-center px-4">
        <span className="text-sm font-semibold text-ia-text-secondary whitespace-nowrap mr-4">
          Universidad Tecnica Nacional - Sede Guanacaste
        </span>
        
        <h1 className="text-xl font-bold flex-1 text-center mx-auto flex items-center justify-center text-ia-text">
          <GiAmberMosquito className="mr-2 text-ia-accent text-2xl" />
          Sistema de Vigilancia Eco-epidemiológico de Mosquitos
        </h1>
        
        <div className="w-48 flex justify-end items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-ia-card transition-colors duration-500 mr-4"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-500" />
            )}
          </button>
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
