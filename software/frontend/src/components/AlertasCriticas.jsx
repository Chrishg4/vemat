import React, { useState, useEffect, useRef } from 'react';
import AlertaEnhanced from './AlertaEnhanced';
import { Spinner } from './SkeletonLoaders';

const AlertasCriticas = ({ alertas, loading }) => {
  const [alertaActual, setAlertaActual] = useState(null);
  const [colaAlertas, setColaAlertas] = useState([]);
  const historialIdsRef = useRef(new Set());
  const [dismissedAlertIds, setDismissedAlertIds] = useState(new Set()); // Nuevo estado para rastrear alertas descartadas

  useEffect(() => {
    if (alertas && alertas.length > 0) {
      const nuevasAlertas = alertas.filter(a => !historialIdsRef.current.has(a.id) && !dismissedAlertIds.has(a.id)); // También filtrar alertas descartadas
      setColaAlertas(prevCola => {
        const colaActualIds = new Set(prevCola.map(item => item.id));
        const alertasParaAnadir = nuevasAlertas.filter(a => !colaActualIds.has(a.id));
        return [...prevCola, ...alertasParaAnadir];
      });
    }
  }, [alertas, dismissedAlertIds]); // Añadir dismissedAlertIds al array de dependencias

  useEffect(() => {
    if (!alertaActual && colaAlertas.length > 0) {
      const proximaAlerta = colaAlertas[0];
      // Solo mostrar si no ha sido descartada
      if (!dismissedAlertIds.has(proximaAlerta.id)) {
        setAlertaActual(proximaAlerta);
        setColaAlertas(colaAlertas.slice(1));
        historialIdsRef.current.add(proximaAlerta.id);
      } else {
        // Si ha sido descartada, simplemente eliminar de la cola e intentar con la siguiente
        setColaAlertas(colaAlertas.slice(1));
      }
    }
  }, [alertaActual, colaAlertas, dismissedAlertIds]); // Añadir dismissedAlertIds al array de dependencias

  useEffect(() => {
    if (alertaActual) {
      const timer = setTimeout(() => {
        handleClose(alertaActual.id); // Pasar la ID a handleClose
      }, 5000); // La alerta se cierra después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [alertaActual]);

  const handleClose = (idToDismiss) => {
    setAlertaActual(null);
    setDismissedAlertIds(prev => new Set(prev).add(idToDismiss)); // Añadir al conjunto de descartadas
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
        onClose={() => handleClose(alertaActual.id)} // Pasar la ID a onClose
      />
    </div>
  );
};

export default AlertasCriticas;
