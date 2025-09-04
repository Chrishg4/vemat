import React, { useState, useEffect, useRef } from 'react';
import AlertaEnhanced from './AlertaEnhanced';
import { Spinner } from './SkeletonLoaders';

const AlertasCriticas = ({ alertas, loading }) => {
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
      }, 5000); // La alerta se cierra después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [alertaActual]);

  const handleClose = () => {
    setAlertaActual(null);
  };

  if (loading) {
    return (
      <div className="fixed bottom-24 right-5 w-[450px] z-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!alertaActual) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-5 w-[450px] z-50 animate-slide-in-up">
      <AlertaEnhanced
        mensaje={alertaActual.mensaje}
        severity="alta"
        onClose={handleClose}
      />
    </div>
  );
};

export default AlertasCriticas;
