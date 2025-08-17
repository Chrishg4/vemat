// src/context/DashboardContext.jsx
import React, { createContext, useContext } from "react";
import { useObtenerLecturas } from "../use/useObtenerLecturas";
import { useObtenerHistorialBioacustica } from "../use/useObtenerHistorialBioacustica";

export const ContextoTablero = createContext();

export function ProveedorContextoTablero({ children }) {
  // Utilizamos el hook useGetReadings para verificar datos nuevos cada 10 segundos
  const { latest, data, alertHistory, loading, error, refreshData, hasNewData, lastUpdateTime } = useObtenerLecturas(true, 10000);
  const { soundHistory } = useObtenerHistorialBioacustica();

  return (
    <ContextoTablero.Provider value={{ 
      latest, 
      data, 
      alertHistory, 
      soundHistory,
      loading,
      error,
      refreshData,
      hasNewData,
      lastUpdateTime
    }}>
      {children}
    </ContextoTablero.Provider>
  );
}

export function useContextoTablero() {
  return useContext(ContextoTablero);
}