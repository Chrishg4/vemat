import React, { useState, useMemo } from 'react';
import { mosquitoData, mosquitoColumns } from '../data/mosquitoData';
import ModalFichaInformativa from './ModalFichaInformativa';
import DownloadMosquitoData from './DownloadMosquitoData';

// Componente para la tarjeta de mosquito
const TarjetaMosquito = ({ mosquito, onVerMas }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <img src={mosquito.imageUrl} alt={mosquito.species} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{mosquito.species}</h3>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{mosquito.description}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Captura: {mosquito.captureDate}</p>
      <button
        onClick={() => onVerMas(mosquito)}
        className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
      >
        Ver más
      </button>
    </div>
  </div>
);

// Componente principal de la galería
const GaleriaMosquitos = () => {
  const [filtroEspecie, setFiltroEspecie] = useState('');
  const [mosquitoSeleccionado, setMosquitoSeleccionado] = useState(null);

  const especiesUnicas = useMemo(() => [
    ...new Set(mosquitoData.map(m => m.species))
  ], []);

  const mosquitosFiltrados = useMemo(() => {
    return mosquitoData.filter(mosquito => {
      const coincideEspecie = filtroEspecie ? mosquito.species === filtroEspecie : true;
      return coincideEspecie;
    });
  }, [filtroEspecie]);

  const abrirModal = (mosquito) => {
    setMosquitoSeleccionado(mosquito);
  };

  const cerrarModal = () => {
    setMosquitoSeleccionado(null);
  };

  return (
    <div id="galeria-mosquitos">
      {/* Controles de Filtro */}
      <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label htmlFor="filtro-especie" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por especie</label>
            <select
              id="filtro-especie"
              value={filtroEspecie}
              onChange={(e) => setFiltroEspecie(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 dark:text-gray-200"
            >
              <option value="">Todas las especies</option>
              {especiesUnicas.map(especie => (
                <option key={especie} value={especie}>{especie}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <DownloadMosquitoData fields={mosquitoColumns} />
          </div>
        </div>
      </div>

      {/* Galería de Mosquitos */}
      {mosquitosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mosquitosFiltrados.map(mosquito => (
            <TarjetaMosquito key={mosquito.id} mosquito={mosquito} onVerMas={abrirModal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No se encontraron mosquitos que coincidan con los filtros.</p>
        </div>
      )}

      {/* Modal de Ficha Informativa */}
      {mosquitoSeleccionado && (
        <ModalFichaInformativa mosquito={mosquitoSeleccionado} onClose={cerrarModal} />
      )}
    </div>
  );
};

export default GaleriaMosquitos;