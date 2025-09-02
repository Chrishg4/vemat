import React from 'react';
import GraficoTempHumedad from '../components/graficoTempHumedad';
import GraficoSemanaEpiCo2 from '../components/graficoSemanaEpiCo2';
import TablaLecturas from '../components/tablaLecturas';

export default function PaginaAnalisisCombinado() {
  return (
    <div className="p-4 space-y-8">
      <div>
        <GraficoTempHumedad chartMode='line' />
      </div>
      <div>
        <GraficoSemanaEpiCo2 />
      </div>
      <div>
        <TablaLecturas showTitle={true} title="Historial de Lecturas" />
      </div>
    </div>
  );
}
