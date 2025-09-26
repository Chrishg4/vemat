// src/components/TarjetaIndicador.jsx
import React from 'react';

const TarjetaIndicador = ({ icono, titulo, valor, unidad, color, minValue, maxValue }) => {
  const IconoComponente = icono;
  return (
    <div className={`bg-ia-card p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-ia-text border border-ia-border transition-all duration-500 hover:shadow-xl`}>
      <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full" style={{ backgroundColor: color }}>
        <IconoComponente className="w-12 h-12" fill="white" />
      </div>
      <h3 className="text-lg font-semibold text-ia-text-secondary">{titulo}</h3>
      <p className="text-4xl font-bold text-ia-text">
        {valor} <span className="text-2xl text-ia-text-secondary">{unidad}</span>
      </p>
      {minValue !== undefined && maxValue !== undefined && (
        <div className="grid grid-cols-2 gap-4 w-full mt-2 text-center">
          <div>
            <p className="text-xs text-ia-text-secondary">Mín</p>
            <p className="text-sm font-bold">{minValue}{unidad}</p>
          </div>
          <div>
            <p className="text-xs text-ia-text-secondary">Máx</p>
            <p className="text-sm font-bold">{maxValue}{unidad}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarjetaIndicador;
