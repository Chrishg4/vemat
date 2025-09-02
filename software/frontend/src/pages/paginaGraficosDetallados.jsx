import React from 'react';
import GraficoTempHumedad from '../components/graficoTempHumedad';
import GraficoBioacustica from '../components/graficoBioacustica';
import { useContextoTablero } from '../context/contextoTablero';

export default function PaginaGraficosDetallados() {
  const { data, latest } = useContextoTablero();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Análisis Detallado de Sensores</h1>

      {/* Gráfico de Temperatura */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Temperatura</h2>
        <div className="h-auto">
          <GraficoTempHumedad 
            chartMode="line" 
            showOnly="temperatura"
            title="Monitoreo de Temperatura"
          />
        </div>
      </div>

      {/* Gráfico de Humedad */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Humedad</h2>
        <div className="h-auto">
          <GraficoTempHumedad 
            chartMode="line" 
            showOnly="humedad"
            title="Monitoreo de Humedad"
          />
        </div>
      </div>

      {/* Gráfico de CO2 */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">CO₂</h2>
        <div className="h-auto">
          <GraficoTempHumedad 
            chartMode="line" 
            showOnly="co2"
            title="Monitoreo de CO₂"
          />
        </div>
      </div>

      {/* Gráfico de Bioacústica */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Bioacústica</h2>
        <GraficoBioacustica data={data} />
      </div>
    </div>
  );
}