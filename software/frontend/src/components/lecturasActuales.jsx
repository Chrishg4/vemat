import React from 'react'
import { useContextoTablero } from '../context/contextoTablero'
import { FaSync, FaMapMarkerAlt } from 'react-icons/fa'
import { FaBell } from 'react-icons/fa'
import DownloadMosquitoData from './DownloadMosquitoData'
import IconoCo2 from './iconoCo2'
import IconoTemperatura from './iconoTemperatura'
import IconoHumedad from './iconoHumedad'
import IconoBioacustica from './iconoBioacustica'
import { CardSkeleton } from './SkeletonLoaders'

const MetricDisplay = ({ label, value, unit, icon: IconComponent, color }) => (
  <div className="flex items-center space-x-3 p-2 bg-ia-card rounded-lg shadow-sm border border-ia-border transition-colors duration-500">
    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: color }}>
      <IconComponent className="w-6 h-6" fill="white" />
    </div>
    <div>
      <p className="text-sm font-semibold text-ia-text-secondary">{label}</p>
      <p className="text-xl font-bold text-ia-text">{value} <span className="text-sm text-ia-text-secondary">{unit}</span></p>
    </div>
  </div>
);

export default function CurrentReadings() {
  const { latest, loading, lastUpdateTime, refreshData, hasNewData, data } = useContextoTablero()
  
  const mostrarIndicadorNuevosDatos = hasNewData && data.length > 0 && !loading

  if (loading) {
    return (
      <div className="bg-ia-card px-4 pt-4 pb-2 rounded-xl shadow-md border border-ia-border w-full transition-colors duration-500">
        <h2 className="text-xl font-semibold text-ia-text mb-2">Lecturas Actuales</h2>
        <CardSkeleton items={8} />
      </div>
    );
  }

  if (!latest || Object.keys(latest).length === 0) return <p className="text-ia-text">No hay datos disponibles.</p>

  return (
    <div className="bg-ia-card px-4 pt-4 pb-2 rounded-xl shadow-md border border-ia-border w-full transition-colors duration-500">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-ia-text">Lecturas Actuales</h2>
        <div className="flex items-center">
          {lastUpdateTime && (
            <span className="text-xs text-ia-text-secondary mr-2">
              Actualizado: {new Date(lastUpdateTime).toLocaleTimeString('es-CR')}
            </span>
          )}
          {mostrarIndicadorNuevosDatos ? (
            <button 
              onClick={refreshData} 
              className="flex items-center text-ia-accent hover:opacity-80 p-1 rounded-full hover:bg-ia-card-hover transition-colors animate-pulse"
              title="Hay nuevos datos disponibles. Haz clic para actualizar."
            >
              <FaBell className="w-4 h-4 mr-1" />
              <span className="text-xs">Nuevos datos</span>
            </button>
          ) : (
            <button 
              onClick={refreshData} 
              className="text-ia-accent hover:opacity-80 p-1 rounded-full hover:bg-ia-card-hover transition-colors"
              title="Actualizar datos"
            >
              <FaSync className="w-4 h-4" />
            </button>
          )}
          {/* Botón de descarga de datos (CSV) */}
          <div className="ml-3">
            <DownloadMosquitoData fields={['nodo_id','fecha','temperatura','humedad','co2','acustica','latitud','longitud']} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {latest.temperatura !== undefined && (
          <MetricDisplay 
            label="Temperatura" 
            value={latest.temperatura.toFixed(1)} 
            unit="°C" 
            icon={IconoTemperatura} 
            color="var(--ia-warning)" 
          />
        )}
        {latest.humedad !== undefined && (
          <MetricDisplay 
            label="Humedad" 
            value={latest.humedad.toFixed(1)} 
            unit="%" 
            icon={IconoHumedad} 
            color="var(--ia-success)" 
          />
        )}
        {latest.co2 !== undefined && (
          <MetricDisplay 
            label="CO₂" 
            value={latest.co2.toFixed(0)} 
            unit="ppm" 
            icon={IconoCo2} 
            color="var(--ia-info)" 
          />
        )}
        {latest.acustica !== undefined && (
          <MetricDisplay 
            label="Bioacústica" 
            value={latest.acustica.toFixed(0)} 
            unit="Hz" 
            icon={IconoBioacustica} 
            color="var(--ia-error)" 
          />
        )}
        {latest.latitud !== undefined && (
          <MetricDisplay 
            label="Latitud" 
            value={latest.latitud.toFixed(5)} 
            unit="" 
            icon={FaMapMarkerAlt} 
            color="var(--ia-primary)" 
          />
        )}
        {latest.longitud !== undefined && (
          <MetricDisplay 
            label="Longitud" 
            value={latest.longitud.toFixed(5)} 
            unit="" 
            icon={FaMapMarkerAlt} 
            color="var(--ia-primary)" 
          />
        )}
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        {latest.nodo_id && (
          <p><span className="text-ia-accent font-semibold">ID de Nodo:</span> <span className="text-ia-text text-xl">{latest.nodo_id}</span></p>
        )}
        {latest.fecha && (
          <p><span className="text-ia-accent font-semibold">Fecha:</span> <span className="text-ia-text text-xl">{new Date(latest.fecha).toLocaleString('es-CR', { timeZone: 'UTC' })}</span></p>
        )}
      </div>
    </div>
  )
}