
import React from 'react';
import GaleriaMosquitos from '../components/GaleriaMosquitos';

const PaginaGaleriaMosquitos = () => {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Galería de Mosquitos</h1>
            <p className="text-gray-600 dark:text-gray-400">Explora las especies de mosquitos capturadas y aprende sobre ellas.</p>
        </div>
        <GaleriaMosquitos />
    </div>
  );
};

export default PaginaGaleriaMosquitos;
