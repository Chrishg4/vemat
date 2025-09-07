import React from 'react';
import AlertaEnhanced from './AlertaEnhanced';

const IAStatusIndicator = ({ status }) => {
  const [showLoading, setShowLoading] = React.useState(true);
  const [showReady, setShowReady] = React.useState(true);
  const [showError, setShowError] = React.useState(true); // Nuevo estado para la alerta de error

  React.useEffect(() => {
    // Restablecer los estados de visualización cuando el estado cambia a un nuevo tipo de alerta
    if (status?.estado === 'CARGANDO' || status?.estado === 'PROCESANDO') {
      setShowReady(true); // Si pasa de DISPONIBLE a CARGANDO, restablecer showReady
      setShowError(true); // Si pasa de ERROR a CARGANDO, restablecer showError
    } else if (status?.estado === 'DISPONIBLE') {
      setShowLoading(true); // Si pasa de CARGANDO a DISPONIBLE, restablecer showLoading
      setShowError(true); // Si pasa de ERROR a DISPONIBLE, restablecer showError
    } else if (status?.estado === 'ERROR') {
      setShowLoading(true); // Si pasa de CARGANDO a ERROR, restablecer showLoading
      setShowReady(true); // Si pasa de DISPONIBLE a ERROR, restablecer showReady
    } else if (status?.estado === 'DEMO') {
      setShowLoading(true);
      setShowReady(true);
      setShowError(true);
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
      {showError && status?.estado === 'ERROR' && ( // Usar showError para el estado ERROR
        <div className="fixed top-6 right-8 z-50 min-w-[260px] animate-fade-in">
          <AlertaEnhanced {...statusProps} onClose={() => setShowError(false)} /> {/* Añadir onClose */}
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
