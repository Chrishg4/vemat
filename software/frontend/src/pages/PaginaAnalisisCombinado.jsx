import React from 'react';
import GraficoTempHumedad from '../components/graficoTempHumedad';
import GraficoSemanaEpiCo2 from '../components/graficoSemanaEpiCo2';
import TablaLecturas from '../components/tablaLecturas';

export default function PaginaAnalisisCombinado() {
  return (
    <div className="p-6 text-ia-text space-y-6">
      <h1 className="text-2xl font-bold mb-2">Análisis Combinado</h1>

      {/* Gráfico de Temperatura y Humedad */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">Gráfico de Temperatura y Humedad</h2>
        <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border transition-colors duration-500 hover:shadow-xl">
          <GraficoTempHumedad chartMode="line" />
        </div>
      </div>

      {/* Evolución de Datos por Semana Epidemiológica */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">Evolución de Datos por Semana Epidemiológica</h2>
        <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border transition-colors duration-500 hover:shadow-xl">
          <GraficoSemanaEpiCo2 />
        </div>
      </div>

      {/* Historial de Lecturas */}
      <div>
        <h2 className="text-xl font-semibold text-ia-text mb-4">Historial de Lecturas</h2>
        <TablaLecturas showTitle={false} /> {/* Disable internal title */}
      </div>
    </div>
  );
}
