// src/pages/ReadingsTablePage.jsx
import React, { useContext } from 'react'; // ¡Corregido!
import ReadingsTable from '../components/ReadingsTable';
import { DashboardDataContext } from '../components/Dashboard';

export default function ReadingsTablePage() {
  const { historial } = useContext(DashboardDataContext);

  if (!historial) {
    return <div>Cargando historial de lecturas...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Historial de Lecturas</h2>
      <ReadingsTable datos={historial} />
    </div>
  );
}