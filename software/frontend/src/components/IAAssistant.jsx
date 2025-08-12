import React, { useState, useEffect } from 'react';
import useIAService from '../hooks/useIAService';
import IAStatusIndicator from './IAStatusIndicator';
import PromptSelector from './PromptSelector';
import ChatInterface from './ChatInterface';

const ESTADOS_IA = {
  CARGANDO: 'CARGANDO',
  DISPONIBLE: 'DISPONIBLE',
  DEMO: 'DEMO',
  ERROR: 'ERROR',
  PROCESANDO: 'PROCESANDO'
};

const IAAssistant = () => {
  const { verificarStatus, consultarIA, loading, error } = useIAService();
  const [statusIA, setStatusIA] = useState({ estado: ESTADOS_IA.CARGANDO });
  const [respuesta, setRespuesta] = useState(null);
  const [historialConsultas, setHistorialConsultas] = useState([]);
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await verificarStatus();
        if (response.success) {
          if (response.modo === 'demo') {
            setStatusIA({ estado: ESTADOS_IA.DEMO, disponible: response.disponible, modo: response.modo });
          } else {
            setStatusIA({ estado: ESTADOS_IA.DISPONIBLE, disponible: response.disponible, modo: response.modo });
          }
        } else {
          setStatusIA({ estado: ESTADOS_IA.ERROR, error: response.error || 'Error desconocido' });
        }
      } catch (err) {
        setStatusIA({ estado: ESTADOS_IA.ERROR, error: err.message });
      }
    };

    getStatus();
    const interval = setInterval(getStatus, 60000); 
    return () => clearInterval(interval);
  }, [verificarStatus]);

  useEffect(() => {
    if (loading) {
      setStatusIA(prev => ({ ...prev, estado: ESTADOS_IA.CARGANDO }));
    } else if (error) {
      setStatusIA(prev => ({ ...prev, estado: ESTADOS_IA.ERROR, error: error }));
    }
  }, [loading, error]);

  const enviarConsulta = async (prompt) => {
    if (!prompt.trim()) return;
    setIsLoadingQuery(true);
    setStatusIA(prev => ({ ...prev, estado: ESTADOS_IA.PROCESANDO }));
    try {
      const res = await consultarIA(prompt);
      if (res.success) {
        setRespuesta(res);
        setHistorialConsultas(prev => [...prev, { pregunta: prompt, respuesta: res }]);
      } else {
        setRespuesta({ respuesta: res.error || 'Error al obtener respuesta.', success: false });
      }
    } catch (err) {
      setRespuesta({ respuesta: `Error: ${err.message}`, success: false });
    } finally {
      setIsLoadingQuery(false);
      const currentStatus = await verificarStatus();
      if (currentStatus.success) {
        if (currentStatus.modo === 'demo') {
          setStatusIA({ estado: ESTADOS_IA.DEMO, disponible: currentStatus.disponible, modo: currentStatus.modo });
        } else {
          setStatusIA({ estado: ESTADOS_IA.DISPONIBLE, disponible: currentStatus.disponible, modo: currentStatus.modo });
        }
      } else {
        setStatusIA({ estado: ESTADOS_IA.ERROR, error: currentStatus.error || 'Error desconocido' });
      }
    }
  };

  const usarPromptSugerido = (promptObj) => {
    enviarConsulta(promptObj.prompt);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-4">Asistente IA VEMAT</h1>
      <IAStatusIndicator status={statusIA} />

      <PromptSelector onSelectPrompt={usarPromptSugerido} />

      <ChatInterface
        enviarConsulta={enviarConsulta}
        isLoadingQuery={isLoadingQuery}
        respuesta={respuesta}
        historialConsultas={historialConsultas}
        statusIA={statusIA}
        ESTADOS_IA={ESTADOS_IA}
      />
    </div>
  );
};

export default IAAssistant;