
import React from 'react';
import { useObtenerLecturas } from '../use/useObtenerLecturas';
import { resumirPorSemanaEpi } from '../utils/utilidadesResumen';
import TablaResumenSemanaEpi from '../components/tablaResumenSemanaEpi';
import GraficoResumenSemanaEpi from '../components/graficoResumenSemanaEpi';
import { TableSkeleton, ChartSkeleton } from '../components/SkeletonLoaders';
import AlertaEnhanced from '../components/AlertaEnhanced';

const PaginaResumenSemanaEpi = () => {
  const { data: rawData, loading, error } = useObtenerLecturas();

  if (loading) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Resumen por Semana Epidemiológica</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
          <h2 className="text-2xl font-semibold mb-4">Tabla de Resumen</h2>
          <TableSkeleton />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Gráfica de Resumen</h2>
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return <AlertaEnhanced mensaje={`Error al cargar los datos: ${error.message}`} severity="alta" />;
  }

  const summarizedData = resumirPorSemanaEpi(rawData);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Resumen por Semana Epidemiológica</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Tabla de Resumen</h2>
        <TablaResumenSemanaEpi data={summarizedData} />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Gráfica de Resumen</h2>
        <GraficoResumenSemanaEpi data={summarizedData} />
      </div>
    </div>
  );
};

export default PaginaResumenSemanaEpi;
