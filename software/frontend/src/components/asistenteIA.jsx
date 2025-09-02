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
  const [isOpen, setIsOpen] = useState(false);

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
          setStatusIA({ estado: ESTADOS_IA.ERROR });
        }
      } catch (error) {
        console.error('Error al verificar estado:', error);
        setStatusIA({ estado: ESTADOS_IA.ERROR });
      }
    };

    getStatus();
  }, [verificarStatus]);

  const handleSeleccionPrompt = async (prompt) => {
    try {
      setIsLoadingQuery(true);
      // Añade el prompt del usuario al historial
      setHistorialConsultas(prev => [...prev, { tipo: 'usuario', mensaje: prompt.titulo }]);
      
      const respuesta = await consultarIA(prompt.prompt);
      
      // Añade la respuesta del asistente al historial
      setHistorialConsultas(prev => [...prev, { 
        tipo: 'asistente', 
        mensaje: respuesta.respuesta,
        contexto_usado: respuesta.contexto_usado,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error al consultar IA:', error);
      setHistorialConsultas(prev => [...prev, { 
        tipo: 'error', 
        mensaje: 'Error al procesar la consulta. Por favor, intente nuevamente.' 
      }]);
    } finally {
      setIsLoadingQuery(false);
    }
  };

  const handleEnviarMensaje = async (mensaje) => {
    try {
      setIsLoadingQuery(true);
      setHistorialConsultas(prev => [...prev, { tipo: 'usuario', mensaje }]);
      const respuesta = await consultarIA(mensaje);
      setHistorialConsultas(prev => [...prev, { 
        tipo: 'asistente', 
        mensaje: respuesta.respuesta 
      }]);
    } catch (error) {
      console.error('Error al consultar IA:', error);
      setHistorialConsultas(prev => [...prev, { 
        tipo: 'error', 
        mensaje: 'Error al procesar la consulta. Por favor, intente nuevamente.' 
      }]);
    } finally {
      setIsLoadingQuery(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center z-50 transform hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100 animate-pulse'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>

      {/* Ventana flotante del asistente */}
      <div className={`fixed bottom-24 right-5 w-[450px] bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl transition-all duration-300 transform z-40
        ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-full pointer-events-none opacity-0'}
        max-h-[85vh] flex flex-col
      `}>
        {/* Barra superior */}
        <div className="flex items-center justify-between p-3 border-b border-sky-500/30 bg-gray-800/50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <span className="text-base font-bold text-sky-300">Asistente VEMAT</span>
            <IndicadorEstadoIA status={statusIA} />
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-gray-700/80 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden flex flex-col bg-transparent">
          {/* Selector de prompts predefinidos */}
          <div className="p-3 border-b border-gray-700/50 bg-black/20">
            <SelectorPrompt onSeleccionPrompt={handleSeleccionPrompt} />
          </div>

          {/* Interfaz del chat */}
          <div className="flex-1 overflow-y-auto p-3">
            <InterfazChat 
              historialConsultas={historialConsultas}
              enviarConsulta={handleEnviarMensaje}
              isLoadingQuery={isLoadingQuery}
              statusIA={statusIA}
              ESTADOS_IA={ESTADOS_IA}
              respuesta={respuesta}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AsistenteIA;