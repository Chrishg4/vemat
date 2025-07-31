// src/pages/CurrentReadingsPage.jsx
import React, { useContext } from 'react';
import CurrentReadings from '../components/CurrentReadings'; // Asegúrate de que esta ruta sea correcta
import { DashboardDataContext } from '../components/Dashboard'; // Importa el contexto

export default function CurrentReadingsPage() {
  const { datosActuales } = useContext(DashboardDataContext); // Obtiene los datos del contexto

  if (!datosActuales) {
    return <div>Cargando lecturas actuales...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Lecturas Actuales</h2>
      <CurrentReadings datos={datosActuales} /> {/* Pasa los datos como prop */}
    </div>
  );
}