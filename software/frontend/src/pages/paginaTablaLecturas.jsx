// src/pages/paginaTablaLecturas.jsx
import React, { useContext } from 'react'; // ¡Corregido!
import TablaLecturas from '../components/tablaLecturas';
import { ContextoTableroDatos } from '../components/tableroPrincipal';

export default function PaginaTablaLecturas() {
  const { historial } = useContext(DashboardDataContext);

  if (!historial) {
    return <div>Cargando historial de lecturas...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Historial de Lecturas</h2>
  <TablaLecturas datos={historial} />
    </div>
  );
}