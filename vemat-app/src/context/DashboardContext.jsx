// src/context/DashboardContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { generarDatos } from "../utils/generarDatos";
import { checkAndSendAlerts } from "../utils/alertService";

export const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [latest, setLatest] = useState({});
  const [data, setData] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);

  useEffect(() => {
    const nuevaLectura = generarDatos();
    setLatest(nuevaLectura);
    setData([nuevaLectura]);
    checkAndSendAlerts(nuevaLectura, setAlertHistory);

    const interval = setInterval(() => {
      const nuevaLectura = generarDatos();
      setLatest(nuevaLectura);
      setData((prev) => [nuevaLectura, ...prev.slice(0, 19)]);
      checkAndSendAlerts(nuevaLectura, setAlertHistory);
    }, 30000); // Actualizamos cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContext.Provider value={{ latest, data, alertHistory, setAlertHistory }}>
      {children}
    </DashboardContext.Provider>
  );
}

// ✅ Este hook es el que debes usar en Dashboard.jsx
export function useDashboardData() {
  return useContext(DashboardContext);
}
