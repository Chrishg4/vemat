
import React from 'react';
import { useObtenerLecturas } from '../use/useObtenerLecturas';
import { resumirPorSemanaEpi } from '../utils/utilidadesResumen';
import TablaResumenSemanaEpi from '../components/tablaResumenSemanaEpi';
import GraficoResumenSemanaEpi from '../components/graficoResumenSemanaEpi';

const PaginaResumenSemanaEpi = () => {
  const { data: rawData, loading, error } = useObtenerLecturas();

  if (loading) {
    return <div className="p-4">Cargando datos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error al cargar los datos: {error.message}</div>;
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
