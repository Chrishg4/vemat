import React from 'react';
import { Spinner } from './SkeletonLoaders';

const getSeverityStyles = (severity) => {
  const baseStyles = "rounded-lg p-4 mb-4 border-l-4 transition-colors";
  switch (severity.toLowerCase()) {
    case 'alta':
      return `${baseStyles} bg-ia-error-bg border-ia-error text-ia-error`;
    case 'media':
      return `${baseStyles} bg-ia-warning-bg border-ia-warning text-ia-warning`;
    case 'baja':
      return `${baseStyles} bg-ia-success-bg border-ia-success text-ia-success`;
    default:
      return `${baseStyles} bg-ia-info-bg border-ia-info text-ia-info`;
  }
};

const AlertIcon = ({ severity }) => {
  const iconClasses = {
    alta: "text-ia-error",
    media: "text-ia-warning",
    baja: "text-ia-success"
  };

  return (
    <div className={`flex-shrink-0 ${iconClasses[severity.toLowerCase()] || 'text-blue-500'}`}>
      {severity.toLowerCase() === 'alta' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) : severity.toLowerCase() === 'media' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
};

const AlertaEnhanced = ({ 
  mensaje, 
  severity = 'info',
  timestamp,
  loading = false,
  onClose,
  className = ''
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className={`${getSeverityStyles(severity)} ${className}`}>
      <div className="flex items-start">
        <AlertIcon severity={severity} />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {mensaje}
          </p>
          {timestamp && (
            <p className="mt-1 text-xs opacity-75">
              {new Date(timestamp).toLocaleString()}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors hover:bg-ia-card-hover"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertaEnhanced;
