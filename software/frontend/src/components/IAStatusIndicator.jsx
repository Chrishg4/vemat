import React from 'react';

const IAStatusIndicator = ({ status }) => {
  let bgColor = 'bg-gray-400';
  let textColor = 'text-gray-800';
  let statusText = 'Desconocido';
  let icon = '❓';

  switch (status?.estado) {
    case 'CARGANDO':
      bgColor = 'bg-ia-info';
      textColor = 'text-white';
      statusText = 'Conectando con asistente...';
      icon = '🔄';
      break;
    case 'DISPONIBLE':
      bgColor = 'bg-ia-primary';
      textColor = 'text-white';
      statusText = 'Asistente IA listo 🤖';
      icon = '✅';
      break;
    case 'DEMO':
      bgColor = 'bg-ia-warning';
      textColor = 'text-white';
      statusText = 'Modo demo activo (respuestas simuladas)';
      icon = '⚠️';
      break;
    case 'ERROR':
      bgColor = 'bg-ia-danger';
      textColor = 'text-white';
      statusText = 'Asistente no disponible';
      icon = '❌';
      break;
    case 'PROCESANDO':
      bgColor = 'bg-ia-info';
      textColor = 'text-white';
      statusText = 'Analizando datos ambientales...';
      icon = '🧠';
      break;
    default:
      if (status?.error) {
        bgColor = 'bg-ia-danger';
        textColor = 'text-white';
        statusText = `Error: ${status.error}`;
        icon = '❌';
      } else if (status?.disponible === false) {
        bgColor = 'bg-ia-danger';
        textColor = 'text-white';
        statusText = 'Asistente no disponible';
        icon = '❌';
      } else if (status?.disponible === true) {
        bgColor = 'bg-ia-primary';
        textColor = 'text-white';
        statusText = 'Asistente IA listo 🤖';
        icon = '✅';
      }
      break;
  }

  return (
    <div className={`p-2 rounded-lg shadow-md flex items-center justify-center ${bgColor} ${textColor}`}>
      <span className="text-xl mr-2">{icon}</span>
      <span className="font-semibold text-sm">{statusText}</span>
    </div>
  );
};

export default IAStatusIndicator;