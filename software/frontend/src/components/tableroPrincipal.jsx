// src/components/tableroPrincipal.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Encabezado from "./encabezado";
import BarraLateral from "./barraLateral";
import PaginaLecturasActuales from "../pages/paginaLecturasActuales";
import GraficoTempHumedad from "./graficoTempHumedad";
import PaginaGraficoTempHumedad from "../pages/paginaGraficoTempHumedad";
import TablaLecturas from "./tablaLecturas";
import VistaMapa from "./vistaMapa";
import VistaTablero from "./vistaTablero";
import PaginaHistorialAlertas from "../pages/paginaHistorialAlertas";
import PaginaGraficoSemanaEpiCo2 from "../pages/paginaGraficoSemanaEpiCo2";
import PaginaResumenSemanaEpi from "../pages/paginaResumenSemanaEpi";
import AsistenteIA from "./asistenteIA";

import { useContextoAuth } from "../context/contextoAuth";
import { useContextoTablero } from "../context/contextoTablero";

export default function Dashboard() {
  const { logout, user } = useContextoAuth();
  const { latest, data } = useContextoTablero();
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
  <BarraLateral username={user} onLogout={logout} />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
  <Encabezado />
        <main className="flex-1 relative z-0 overflow-y-auto no-scrollbar focus:outline-none">
          <div className="p-2 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<VistaTablero />} />
              <Route path="/lecturas-actuales" element={<PaginaLecturasActuales />} />
              <Route path="/grafica" element={<PaginaGraficoTempHumedad />} />
              <Route path="/mapa" element={<VistaMapa coordenadas={coordenadasSensor} />} />
              <Route path="/historial" element={<TablaLecturas showTitle={true} title="Historial de Lecturas" />} />
              <Route path="/alertas" element={<PaginaHistorialAlertas />} />
              <Route path="/epi-week-chart" element={<PaginaGraficoSemanaEpiCo2 />} />
              <Route path="/resumen-semanal" element={<PaginaResumenSemanaEpi />} />
              <Route path="/ia-assistant" element={<AsistenteIA />} /> {/* Nueva ruta para AsistenteIA */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}