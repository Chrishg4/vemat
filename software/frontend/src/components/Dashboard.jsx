// src/components/Dashboard.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CurrentReadings from "./CurrentReadings";
import TempHumidityChart from "./TempHumidityChart";
import ReadingsTable from "./ReadingsTable";
import MapView from "./MapView";
import MainDashboard from "./MainDashboard";
import AlertHistoryPage from "../pages/AlertHistoryPage";
import CO2EpiWeekChartPage from "../pages/CO2EpiWeekChartPage";
import EpiWeekSummaryPage from "../pages/EpiWeekSummaryPage";

import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../context/DashboardContext";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const { latest, data } = useDashboardData();
  const location = useLocation();

  const coordenadasSensor = {
    lat: latest.latitude || 10.43079,
    lng: latest.longitude || -85.08499,
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <Sidebar username={user} onLogout={logout} />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header />
        <main className="flex-1 relative z-0 overflow-y-auto no-scrollbar focus:outline-none">
          <div className="p-2 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<MainDashboard />} />
              <Route path="/lecturas-actuales" element={<CurrentReadings lectura={latest} />} />
              <Route path="/grafica" element={<TempHumidityChart datos={data} />} />
              <Route path="/mapa" element={<MapView coordenadas={coordenadasSensor} />} />
              <Route path="/historial" element={<ReadingsTable showTitle={true} title="Historial de Lecturas" />} />
              <Route path="/alertas" element={<AlertHistoryPage />} />
              <Route path="/epi-week-chart" element={<CO2EpiWeekChartPage />} />
              <Route path="/resumen-semanal" element={<EpiWeekSummaryPage />} />
              
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
