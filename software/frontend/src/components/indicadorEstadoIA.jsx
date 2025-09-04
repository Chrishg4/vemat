import React from 'react';
import AlertaEnhanced from './AlertaEnhanced';

const IAStatusIndicator = ({ status }) => {
  const [showLoading, setShowLoading] = React.useState(true);
  const [showReady, setShowReady] = React.useState(true);

  React.useEffect(() => {
    if (status?.estado === 'CARGANDO' || status?.estado === 'PROCESANDO') {
      setShowLoading(true);
    }
    if (status?.estado === 'DISPONIBLE') {
      setShowReady(true);
    }
  }, [status?.estado]);

  const getStatusProps = () => {
    switch (status?.estado) {
      case 'CARGANDO':
        return { severity: 'info', mensaje: 'Conectando con asistente...', loading: true };
      case 'PROCESANDO':
        return { severity: 'info', mensaje: 'Analizando datos ambientales...', loading: true };
      case 'DISPONIBLE':
        return { severity: 'baja', mensaje: 'Asistente IA listo' };
      case 'DEMO':
        return { severity: 'media', mensaje: 'Modo demo activo (respuestas simuladas)' };
      case 'ERROR':
        return { severity: 'alta', mensaje: 'Asistente no disponible' };
      default:
        return { severity: 'alta', mensaje: 'Estado desconocido' };
    }
  };

  const statusProps = getStatusProps();

  return (
    <>
      {showLoading && (status?.estado === 'CARGANDO' || status?.estado === 'PROCESANDO') && (
        <div className="fixed top-6 right-8 z-50 min-w-[260px] animate-fade-in">
          <AlertaEnhanced {...statusProps} onClose={() => setShowLoading(false)} />
        </div>
      )}
      {showReady && status?.estado === 'DISPONIBLE' && (
        <div className="fixed top-24 right-8 z-40 min-w-[260px]">
          <AlertaEnhanced {...statusProps} onClose={() => setShowReady(false)} />
        </div>
      )}
      {status?.estado === 'ERROR' && (
        <div className="fixed top-6 right-8 z-50 min-w-[260px] animate-fade-in">
          <AlertaEnhanced {...statusProps} />
        </div>
      )}
       {status?.estado === 'DEMO' && (
        <div className="fixed top-6 right-8 z-50 min-w-[260px] animate-fade-in">
          <AlertaEnhanced {...statusProps} />
        </div>
      )}
    </>
  );
};

export default IAStatusIndicator;
