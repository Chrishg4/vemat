import React, { useState, useEffect } from 'react';
import useServicioIA from '../hooks/useServicioIA';
import IndicadorEstadoIA from './indicadorEstadoIA';
import SelectorPrompt from './selectorPrompt';
import InterfazChat from './interfazChat';

const ESTADOS_IA = {
  CARGANDO: 'CARGANDO',
  DISPONIBLE: 'DISPONIBLE',
  DEMO: 'DEMO',
  ERROR: 'ERROR',
  PROCESANDO: 'PROCESANDO'
};

const AsistenteIA = () => {
  const { verificarStatus, consultarIA, loading, error } = useServicioIA();
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
    <div className="p-4 bg-gray-900 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Asistente IA VEMAT</h1>
        <div className="border-b border-cyan-600 mb-6"></div>
        <IndicadorEstadoIA status={statusIA} />

        {/* Prompts rápidos en tarjetas tipo grid */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Prompts Rápidos</h2>
          <SelectorPrompt
            onSelectPrompt={usarPromptSugerido}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            cardStyle="bg-gray-900 text-gray-100 rounded-xl shadow-md p-6 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-xl border border-gray-700 cursor-pointer"
            iconStyle="text-3xl mr-3"
          />
        </div>

        {/* Panel de conversación con burbujas y sombra */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Conversación con el Asistente</h2>
          <InterfazChat
            enviarConsulta={enviarConsulta}
            isLoadingQuery={isLoadingQuery}
            respuesta={respuesta}
            historialConsultas={historialConsultas}
            statusIA={statusIA}
            ESTADOS_IA={ESTADOS_IA}
            bubbleStyle="rounded-xl px-4 py-3 mb-2 shadow-md bg-gray-900 text-gray-100 animate-fade-in"
            inputStyle="rounded-lg px-4 py-2 bg-gray-900 text-white border border-cyan-600 shadow focus:outline-none focus:ring-2 focus:ring-cyan-500"
            sendButtonStyle="rounded-lg px-4 py-2 bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition ml-2"
            downloadButtonStyle="rounded-lg px-4 py-2 bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition mb-4 flex items-center gap-2"
          />
        </div>
      </div>
    </div>
  );
};

export default AsistenteIA;