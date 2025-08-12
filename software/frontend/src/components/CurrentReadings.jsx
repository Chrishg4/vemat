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
        {latest.nodo_id && (
          <p><span className="text-blue-400 font-semibold">ID de Nodo:</span> <span className="text-gray-300 text-xl">{latest.nodo_id}</span></p>
        )}
        {latest.fecha && (
          <p><span className="text-blue-400 font-semibold">Fecha:</span> <span className="text-gray-300 text-xl">{new Date(latest.fecha).toLocaleString('es-CR', { timeZone: 'UTC' })}</span></p>
        )}
        <p><span className="text-blue-400 font-semibold">Temperatura:</span> <span className="text-gray-300 text-xl">{latest.temperatura} °C</span></p>
        <p><span className="text-blue-400 font-semibold">Humedad:</span> <span className="text-gray-300 text-xl">{latest.humedad} %</span></p>
        <p><span className="text-blue-400 font-semibold">CO₂:</span> <span className="text-gray-300 text-xl">{latest.co2} ppm</span></p>
        <p><span className="text-blue-400 font-semibold">Acustica:</span> <span className="text-gray-300 text-xl">{latest.acustica} Hz</span></p>
        {latest.ubicacion && (
          <p><span className="text-blue-400 font-semibold">Ubicación:</span> <span className="text-gray-300 text-xl">{latest.ubicacion}</span></p>
        )}
      </div>
    </div>
  )
}
