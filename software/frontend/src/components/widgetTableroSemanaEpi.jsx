
import React from 'react';
import { useObtenerLecturas } from '../use/useObtenerLecturas';
import { resumirPorSemanaEpi } from '../utils/utilidadesResumen';
import { getEpiWeek } from '../utils/utilidadesSemanaEpi';
import { FaTemperatureHigh, FaTint, FaVolumeUp } from 'react-icons/fa';
import IconoCo2 from './iconoCo2';

const MetricDisplay = ({ label, data, unit, icon: IconComponent, color }) => (
  <div className="p-4 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center text-white border border-gray-700">
    <div className="flex items-center justify-center w-16 h-16 mb-3 rounded-full" style={{ backgroundColor: color }}>
      <IconComponent className="w-10 h-10" />
    </div>
    <h4 className="text-lg font-semibold text-gray-300 mb-2">{label}</h4>
    <p className="text-4xl font-bold text-white mb-2">
      {data.avg?.toFixed(1) ?? 'N/A'} <span className="text-2xl text-gray-400">{unit}</span>
    </p>
    <div className="grid grid-cols-2 gap-2 text-center w-full">
      <div>
        <p className="text-xs text-gray-400">Mín</p>
        <p className="text-md font-bold text-blue-400">{data.min?.toFixed(1) ?? 'N/A'}{unit}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Máx</p>
        <p className="text-md font-bold text-red-400">{data.max?.toFixed(1) ?? 'N/A'}{unit}</p>
      </div>
    </div>
  </div>
);

const WidgetTableroSemanaEpi = () => {
  const { data: rawData, loading, error } = useObtenerLecturas();

  if (loading) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-xl text-white">Cargando resumen semanal...</div>;
  }

  if (error) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-xl text-red-500">Error: {error.message}</div>;
  }

  const summarizedData = resumirPorSemanaEpi(rawData);
  const currentWeek = getEpiWeek(new Date());
  const currentYear = new Date().getFullYear();
  const currentWeekKey = `${currentYear}-EW${String(currentWeek).padStart(2, '0')}`;

  const currentWeekData = summarizedData.find(week => week.key === currentWeekKey);

  if (!currentWeekData) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-xl text-white">
        <h3 className="text-xl font-bold mb-2">Resumen de la Semana Actual (SE{currentWeek}/{currentYear})</h3>
        <p>Aún no hay datos disponibles para la semana epidemiológica actual.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-xl text-white">
      <h3 className="text-xl font-bold mb-4">Resumen de la Semana Actual ({currentWeekData.name})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay label="Temperatura" data={currentWeekData.temperatura} unit="°C" icon={FaTemperatureHigh} color="#ff7300" />
        <MetricDisplay label="Humedad" data={currentWeekData.humedad} unit="%" icon={FaTint} color="#387908" />
  <MetricDisplay label="CO2" data={currentWeekData.co2} unit=" ppm" icon={IconoCo2} color="#0088FE" />
        <MetricDisplay label="Bioacustica" data={currentWeekData.acustica} unit=" Hz" icon={FaVolumeUp} color="#FF0000" />
      </div>
    </div>
  );
};

export default WidgetTableroSemanaEpi;
