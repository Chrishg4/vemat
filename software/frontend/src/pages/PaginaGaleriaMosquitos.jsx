
import React from 'react';
import GaleriaMosquitos from '../components/GaleriaMosquitos';

const PaginaGaleriaMosquitos = () => {
  return (
    <div className="p-6 text-ia-text space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Galería de Mosquitos</h1>
        <p className="text-ia-text-secondary">Explora las especies de mosquitos capturadas y aprende sobre ellas.</p>
      </div>

      <div className="bg-ia-card p-6 rounded-xl shadow-lg border border-ia-border">
        <GaleriaMosquitos />
      </div>
    </div>
  );
};

export default PaginaGaleriaMosquitos;
