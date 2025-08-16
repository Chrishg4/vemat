import React from 'react';
import { MdCheckCircle, MdError, MdAutorenew, MdWarning, MdPsychology } from 'react-icons/md';

const IAStatusIndicator = ({ status }) => {
  const [showLoading, setShowLoading] = React.useState(true);
  const [showReady, setShowReady] = React.useState(true);
  React.useEffect(() => {
    if (status?.estado === 'CARGANDO' || status?.estado === 'PROCESANDO') {
      setShowLoading(true); // Siempre visible hasta que el usuario lo cierre
    }
    if (status?.estado === 'DISPONIBLE') {
      setShowReady(true);
    }
  }, [status?.estado]);

  let bgColor = 'bg-gray-400';
  let textColor = 'text-gray-800';
  let statusText = 'Desconocido';
  let icon = <MdError />;

  switch (status?.estado) {
    case 'CARGANDO':
      bgColor = 'bg-ia-info';
      textColor = 'text-white';
      statusText = 'Conectando con asistente...';
      icon = <MdAutorenew className="animate-spin" />;
      break;
    case 'DISPONIBLE':
      bgColor = 'bg-ia-primary';
      textColor = 'text-white';
      statusText = 'Asistente IA listo';
      icon = <MdCheckCircle />;
      break;
    case 'DEMO':
      bgColor = 'bg-ia-warning';
      textColor = 'text-white';
      statusText = 'Modo demo activo (respuestas simuladas)';
      icon = <MdWarning />;
      break;
    case 'ERROR':
      bgColor = 'bg-ia-danger';
      textColor = 'text-white';
      statusText = 'Asistente no disponible';
      icon = <MdError />;
      break;
    case 'PROCESANDO':
      bgColor = 'bg-ia-info';
      textColor = 'text-white';
      statusText = 'Analizando datos ambientales...';
      icon = <MdPsychology />;
      break;
    default:
      if (status?.error) {
        bgColor = 'bg-ia-danger';
        textColor = 'text-white';
        statusText = `Error: ${status.error}`;
        icon = <MdError />;
      } else if (status?.disponible === false) {
        bgColor = 'bg-ia-danger';
        textColor = 'text-white';
        statusText = 'Asistente no disponible';
        icon = <MdError />;
      } else if (status?.disponible === true) {
        bgColor = 'bg-ia-primary';
        textColor = 'text-white';
        statusText = 'Asistente IA listo';
        icon = <MdCheckCircle />;
      }
      break;
  }

  // Toaster flotante en la parte superior derecha
  return (
    <>
      {/* Toaster de carga o procesando */}
      {showLoading && (['CARGANDO', 'PROCESANDO'].includes(status?.estado)) && (
        <div className={`fixed top-6 right-8 z-50 min-w-[260px] p-3 rounded-xl shadow-xl flex items-center gap-3 bg-ia-info text-white animate-fade-in`}>
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold text-base">{statusText}</span>
          <button
            className="ml-auto text-white text-lg font-bold bg-transparent hover:text-red-400 focus:outline-none"
            onClick={() => setShowLoading(false)}
            aria-label="Cerrar notificación"
          >×</button>
        </div>
      )}
      {/* Toaster de listo */}
      {showReady && status?.estado === 'DISPONIBLE' && (
        <div className={`fixed top-24 right-8 z-40 min-w-[260px] p-3 rounded-xl shadow-lg flex items-center gap-3 bg-ia-primary text-white`}>
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold text-base">{statusText}</span>
          <button
            className="ml-auto text-white text-lg font-bold bg-transparent hover:text-red-400 focus:outline-none"
            onClick={() => setShowReady(false)}
            aria-label="Cerrar notificación"
          >×</button>
        </div>
      )}
    </>
  );
};

export default IAStatusIndicator;