// src/components/tableroPrincipal.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Encabezado from "./encabezado";
import BarraLateral from "./barraLateral";
import PaginaLecturasActuales from "../pages/paginaLecturasActuales";
import VistaTablero from "./vistaTablero";
import PaginaHistorialAlertas from "../pages/paginaHistorialAlertas";
import PaginaResumenSemanaEpi from "../pages/paginaResumenSemanaEpi";
import AsistenteIA from "./asistenteIA";
import PaginaAnalisisCombinado from "../pages/PaginaAnalisisCombinado";
import PaginaMapasCombinados from "../pages/PaginaMapasCombinados";
import PaginaGraficosDetallados from "../pages/paginaGraficosDetallados";

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
    <div className="flex h-screen overflow-hidden bg-ia-background transition-colors duration-500">
      <BarraLateral username={user} onLogout={logout} />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Encabezado />
        <main className="flex-1 relative z-0 overflow-y-auto no-scrollbar focus:outline-none transition-colors duration-500">
          <div className="p-4 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<VistaTablero />} />
              <Route path="/lecturas-actuales" element={<PaginaLecturasActuales />} />
              <Route path="/analisis" element={<PaginaAnalisisCombinado />} />
              <Route path="/mapas" element={<PaginaMapasCombinados />} />
              <Route path="/graficos-detallados" element={<PaginaGraficosDetallados />} />
              <Route path="/alertas" element={<PaginaHistorialAlertas />} />
              <Route path="/resumen-semanal" element={<PaginaResumenSemanaEpi />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}