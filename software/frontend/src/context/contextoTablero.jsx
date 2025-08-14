// src/context/DashboardContext.jsx
import React, { createContext, useContext } from "react";
import { useObtenerLecturas } from "../use/useObtenerLecturas";
import { useObtenerHistorialBioacustica } from "../use/useObtenerHistorialBioacustica";

export const ContextoTablero = createContext();

export function ProveedorContextoTablero({ children }) {
  // Utilizamos el hook useGetReadings para obtener los datos con intervalo de 2 minutos
  const { latest, data, alertHistory, loading, error, refreshData } = useObtenerLecturas(true, 120000);
  const { soundHistory } = useObtenerHistorialBioacustica();

  return (
    <ContextoTablero.Provider value={{ 
      latest, 
      data, 
      alertHistory, 
      soundHistory,
      loading,
      error,
      refreshData
    }}>
      {children}
    </ContextoTablero.Provider>
  );
}

export function useContextoTablero() {
  return useContext(ContextoTablero);
}