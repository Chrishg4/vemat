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

  const descargarHistorialChat = () => {
    if (historialConsultas.length === 0) {
      alert("No hay historial de chat para descargar.");
      return;
    }

    // Formatear el historial para el archivo de texto
    const historialFormateado = historialConsultas.map((item, index) => {
      const pregunta = `Pregunta ${index + 1}: ${item.pregunta}`;
      const respuesta = `Respuesta ${index + 1}: ${item.respuesta.respuesta}`;
      return `${pregunta}
${respuesta}
--------------------`;
    }).join('\n\n');

    // Crear un Blob con el contenido
    const blob = new Blob([historialFormateado], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace temporal y simular un clic para la descarga
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'historial-chat.txt';
    document.body.appendChild(enlace);
    enlace.click();

    // Limpiar el objeto URL y el enlace temporal
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-4">Asistente IA VEMAT</h1>
      <IndicadorEstadoIA status={statusIA} />

      <SelectorPrompt onSelectPrompt={usarPromptSugerido} />

      <InterfazChat
        enviarConsulta={enviarConsulta}
        isLoadingQuery={isLoadingQuery}
        respuesta={respuesta}
        historialConsultas={historialConsultas}
        statusIA={statusIA}
        ESTADOS_IA={ESTADOS_IA}
        onDescargarChat={descargarHistorialChat}
      />
    </div>
  );
};

export default AsistenteIA;