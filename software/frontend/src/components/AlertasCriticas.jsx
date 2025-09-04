import React, { useState, useEffect, useRef } from 'react';

const AlertasCriticas = ({ alertas }) => {
  const [alertaActual, setAlertaActual] = useState(null);
  const [colaAlertas, setColaAlertas] = useState([]);
  const historialIdsRef = useRef(new Set());

  useEffect(() => {
    if (alertas && alertas.length > 0) {
      const nuevasAlertas = alertas.filter(a => !historialIdsRef.current.has(a.id));
      setColaAlertas(prevCola => {
        const colaActualIds = new Set(prevCola.map(item => item.id));
        const alertasParaAnadir = nuevasAlertas.filter(a => !colaActualIds.has(a.id));
        return [...prevCola, ...alertasParaAnadir];
      });
    }
  }, [alertas]);

  useEffect(() => {
    if (!alertaActual && colaAlertas.length > 0) {
      const proximaAlerta = colaAlertas[0];
      setAlertaActual(proximaAlerta);
      setColaAlertas(colaAlertas.slice(1));
      historialIdsRef.current.add(proximaAlerta.id);
    }
  }, [alertaActual, colaAlertas]);

  useEffect(() => {
    if (alertaActual) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertaActual]);

  const handleClose = () => {
    setAlertaActual(null);
  };

  if (!alertaActual) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-5 w-[450px] bg-gray-900/80 backdrop-blur-sm border border-red-500/50 rounded-xl shadow-2xl transition-all duration-300 transform z-50 animate-slide-in-up">
      <div className="flex items-center justify-between p-3 border-b border-red-500/30 bg-gray-800/50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <span className="text-base font-bold text-red-300">Alerta de Condición Crítica</span>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <p className="text-white">
          {alertaActual.mensaje}
        </p>
      </div>
    </div>
  );
};

export default AlertasCriticas;