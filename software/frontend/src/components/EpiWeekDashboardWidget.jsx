
import React from 'react';
import { useGetReadings } from '../use/useGetReadings';
import { summarizeByEpiWeek } from '../utils/summaryUtils';
import { getEpiWeek } from '../utils/epiWeekUtils';

const MetricDisplay = ({ label, data, unit }) => (
  <div className="p-3 bg-gray-700 rounded-lg">
    <h4 className="text-md font-semibold text-white mb-2">{label}</h4>
    <div className="grid grid-cols-3 gap-2 text-center">
      <div>
        <p className="text-xs text-gray-400">Mín</p>
        <p className="text-lg font-bold text-blue-400">{data.min?.toFixed(1) ?? 'N/A'}{unit}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Prom</p>
        <p className="text-xl font-bold text-white">{data.avg?.toFixed(1) ?? 'N/A'}{unit}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Máx</p>
        <p className="text-lg font-bold text-red-400">{data.max?.toFixed(1) ?? 'N/A'}{unit}</p>
      </div>
    </div>
  </div>
);

const EpiWeekDashboardWidget = () => {
  const { data: rawData, loading, error } = useGetReadings();

  if (loading) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-xl text-white">Cargando resumen semanal...</div>;
  }

  if (error) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-xl text-red-500">Error: {error.message}</div>;
  }

  const summarizedData = summarizeByEpiWeek(rawData);
  const currentEpiWeek = getEpiWeek(new Date());
  const currentYear = new Date().getFullYear();
  const currentWeekKey = `${currentYear}-EW${String(currentEpiWeek).padStart(2, '0')}`;

  const currentWeekData = summarizedData.find(week => week.key === currentWeekKey);

  if (!currentWeekData) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-xl text-white">
        <h3 className="text-xl font-bold mb-2">Resumen de la Semana Actual (SE{currentEpiWeek})</h3>
        <p>Aún no hay datos disponibles para la semana epidemiológica actual.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-xl text-white">
      <h3 className="text-xl font-bold mb-4">Resumen de la Semana Actual ({currentWeekData.name})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay label="Temperatura" data={currentWeekData.temperatura} unit="°C" />
        <MetricDisplay label="Humedad" data={currentWeekData.humedad} unit="%" />
        <MetricDisplay label="CO2" data={currentWeekData.co2} unit=" ppm" />
        <MetricDisplay label="Bioacustica" data={currentWeekData.acustica} unit=" Hz" />
      </div>
    </div>
  );
};

export default EpiWeekDashboardWidget;
