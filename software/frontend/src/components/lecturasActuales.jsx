import React from 'react'
import { useContextoTablero } from '../context/contextoTablero'
import { FaSync } from 'react-icons/fa'
import { FaBell } from 'react-icons/fa'

export default function CurrentReadings() {
  const { latest, loading, lastUpdateTime, refreshData, hasNewData, data } = useContextoTablero()
  
  // Solo mostrar el indicador de nuevos datos si:
  // 1. hasNewData es true
  // 2. Ya tenemos datos cargados (data.length > 0)
  // 3. No estamos en proceso de carga inicial (loading es false)
  const mostrarIndicadorNuevosDatos = hasNewData && data.length > 0 && !loading

  if (loading) return <p className="text-white">Cargando datos...</p>

  if (!latest || Object.keys(latest).length === 0) return <p className="text-white">No hay datos disponibles.</p>

  return (
    <div className="bg-gray-900 px-4 pt-4 pb-2 rounded-xl shadow-lg border border-gray-800 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-white">Lecturas Actuales</h2>
        <div className="flex items-center">
          {lastUpdateTime && (
            <span className="text-xs text-gray-400 mr-2">
              Actualizado: {new Date(lastUpdateTime).toLocaleTimeString('es-CR')}
            </span>
          )}
          {mostrarIndicadorNuevosDatos ? (
            <button 
              onClick={refreshData} 
              className="flex items-center text-green-500 hover:text-green-400 p-1 rounded-full hover:bg-gray-800 transition-colors animate-pulse"
              title="Hay nuevos datos disponibles. Haz clic para actualizar."
            >
              <FaBell className="w-4 h-4 mr-1" />
              <span className="text-xs">Nuevos datos</span>
            </button>
          ) : (
            <button 
              onClick={refreshData} 
              className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-gray-800 transition-colors"
              title="Actualizar datos"
            >
              <FaSync className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
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
        <p><span className="text-blue-400 font-semibold">Bioacustica:</span> <span className="text-gray-300 text-xl">{latest.acustica} Hz</span></p>
        <p>
          <span className="text-blue-400 font-semibold">Latitud:</span> <span className="text-gray-300 text-xl">{latest.latitud !== undefined ? latest.latitud.toFixed(5) : 'N/A'}</span>
        </p>
        <p>
          <span className="text-blue-400 font-semibold">Longitud:</span> <span className="text-gray-300 text-xl">{latest.longitud !== undefined ? latest.longitud.toFixed(5) : 'N/A'}</span>
        </p>
      </div>
    </div>
  )
}
