import React from 'react'
import { useDashboardData } from '../context/DashboardContext'

export default function CurrentReadings() {
  const { latest, loading } = useDashboardData()

  if (loading) return <p className="text-white">Cargando datos...</p>

  if (!latest || Object.keys(latest).length === 0) return <p className="text-white">No hay datos disponibles.</p>

  return (
    <div className="bg-gray-900 px-4 pt-4 pb-2 rounded-xl shadow-lg border border-gray-800 w-full">
      <h2 className="text-xl font-semibold mb-2 text-white">Lecturas Actuales</h2>
      <div className="flex flex-col space-y-2">
        {latest.fecha && (
          <p><span className="text-blue-400 font-semibold">Fecha:</span> <span className="text-gray-300 text-xl">{new Date(latest.fecha).toLocaleString('es-CR', { timeZone: 'UTC' })}</span></p>
        )}
        <p><span className="text-blue-400 font-semibold">Temperatura:</span> <span className="text-gray-300 text-xl">{latest.temperatura} °C</span></p>
        <p><span className="text-blue-400 font-semibold">Humedad:</span> <span className="text-gray-300 text-xl">{latest.humedad} %</span></p>
        <p><span className="text-blue-400 font-semibold">CO₂:</span> <span className="text-gray-300 text-xl">{latest.co2} ppm</span></p>
        <p><span className="text-blue-400 font-semibold">Sonido:</span> <span className="text-gray-300 text-xl">{latest.sonido} Hz</span></p>
        <p><span className="text-blue-400 font-semibold">Cantón:</span> <span className="text-gray-300 text-xl">Cañas</span></p>
      </div>
    </div>
  )
}
