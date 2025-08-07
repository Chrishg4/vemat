// src/components/CurrentReadings.jsx
import React from 'react'
import { useDashboardData } from '../context/DashboardContext'

export default function CurrentReadings() {
  const { latest } = useDashboardData()

  if (!latest || Object.keys(latest).length === 0) return <p className="text-white">Cargando datos...</p>

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800 mb-4">
      <h2 className="text-xl font-semibold mb-2 text-white">Última lectura</h2>
      <p><span className="text-blue-400 font-semibold">Temperatura:</span> <span className="text-gray-300">{latest.temperatura} °C</span></p>
      <p><span className="text-blue-400 font-semibold">Humedad:</span> <span className="text-gray-300">{latest.humedad} %</span></p>
      <p><span className="text-blue-400 font-semibold">CO₂:</span> <span className="text-gray-300">{latest.co2} ppm</span></p>
      <p><span className="text-blue-400 font-semibold">Cantón:</span> <span className="text-gray-300">Cañas</span></p>
    </div>
  )
}
