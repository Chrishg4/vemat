// src/context/DashboardContext.jsx
import React, { createContext, useContext } from "react";
import { useGetReadings } from "../use/useGetReadings";
import { useGetBioacusticaHistory } from "../use/useGetBioacusticaHistory";

export const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  // Utilizamos el hook useGetReadings para obtener los datos con intervalo de 2 minutos
  const { latest, data, alertHistory, loading, error, refreshData } = useGetReadings(true, 120000);
  const { soundHistory } = useGetBioacusticaHistory();

  return (
    <DashboardContext.Provider value={{ 
      latest, 
      data, 
      alertHistory, 
      soundHistory,
      loading,
      error,
      refreshData
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardData() {
  return useContext(DashboardContext);
}