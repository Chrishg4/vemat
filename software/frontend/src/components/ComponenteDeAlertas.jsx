import React from 'react';
import useAlertasCriticas from '../hooks/useAlertasCriticas';
import AlertasCriticas from './AlertasCriticas';

const ComponenteDeAlertas = () => {
  const { gruposDeAlerta, loading } = useAlertasCriticas();

  if (loading) {
    return null; // O un spinner de carga si se prefiere
  }

  return <AlertasCriticas alertas={gruposDeAlerta} />;
};

export default ComponenteDeAlertas;