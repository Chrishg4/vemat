import React from 'react';
import GraficoTempHumedad from '../components/graficoTempHumedad';
import GraficoBioacustica from '../components/graficoBioacustica';
import { useContextoTablero } from '../context/contextoTablero';

export default function PaginaGraficosDetallados() {
  const { data, latest } = useContextoTablero();

  return (
    <div className="p-6 text-ia-text space-y-6">
      <h1 className="text-2xl font-bold mb-2">Análisis Detallado de Sensores</h1>

      {/* Gráfico de Temperatura */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">Temperatura</h2>
        <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border transition-colors duration-500 hover:shadow-xl">
          <div className="h-auto">
            <GraficoTempHumedad 
              chartMode="line" 
              showOnly="temperatura"
              title={null} // Ensure no internal title is rendered
            />
          </div>
        </div>
      </div>

      {/* Gráfico de Humedad */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">Humedad</h2>
        <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border transition-colors duration-500 hover:shadow-xl">
          <div className="h-auto">
            <GraficoTempHumedad 
              chartMode="line" 
              showOnly="humedad"
              title={null} // Ensure no internal title is rendered
            />
          </div>
        </div>
      </div>

      {/* Gráfico de CO2 */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">CO₂</h2>
        <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border transition-colors duration-500 hover:shadow-xl">
          <div className="h-auto">
            <GraficoTempHumedad 
              chartMode="line" 
              showOnly="co2"
              title={null} // Ensure no internal title is rendered
            />
          </div>
        </div>
      </div>

      {/* Gráfico de Bioacústica */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">Bioacústica</h2>
        <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border transition-colors duration-500 hover:shadow-xl">
          <GraficoBioacustica data={data} />
        </div>
      </div>
    </div>
  );
}
