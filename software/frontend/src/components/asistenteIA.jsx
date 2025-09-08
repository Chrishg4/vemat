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
  const [historialConsultas, setHistorialConsultas] = useState([]);
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await verificarStatus();
        setStatusIA({
          estado: response.success ? (response.modo === 'demo' ? ESTADOS_IA.DEMO : ESTADOS_IA.DISPONIBLE) : ESTADOS_IA.ERROR,
          ...response
        });
      } catch (error) {
        console.error('Error al verificar estado:', error);
        setStatusIA({ estado: ESTADOS_IA.ERROR });
      }
    };
    getStatus();
  }, [verificarStatus]);

  const enviarConsultaUnificada = async (textoUsuario, textoParaIA) => {
    if (!textoParaIA.trim()) return;

    try {
      setIsLoadingQuery(true);
      setHistorialConsultas(prev => [...prev, { tipo: 'usuario', mensaje: textoUsuario }]);
      
      const respuesta = await consultarIA(textoParaIA);
      
      setHistorialConsultas(prev => [...prev, { 
        tipo: 'asistente', 
        mensaje: respuesta.respuesta,
        contexto_usado: respuesta.contexto_usado,
        timestamp: new Date()
      }]);
      setMensaje(''); // Limpiar el input de texto
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

  // Se llama al enviar desde el input de texto
  const handleEnviarMensaje = () => {
    enviarConsultaUnificada(mensaje, mensaje);
  };

  // Se llama al hacer clic en un prompt rápido
  const handleSeleccionPrompt = (prompt) => {
    enviarConsultaUnificada(prompt.titulo, prompt.prompt);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center z-50 transform hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100 animate-pulse'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20L7 20C5.89543 20 5 19.1046 5 18L5 9C5 7.89543 5.89543 7 7 7L17 7C18.1046 7 19 7.89543 19 9L19 18C19 19.1046 18.1046 20 17 20zM15 7L15 3M9 7L9 3M10 11.5C10 11.2239 9.77614 11 9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5zM15 11.5C15 11.2239 14.7761 11 14.5 11C14.2239 11 14 11.2239 14 11.5C14 11.7761 14.2239 12 14.5 12C14.7761 12 15 11.7761 15 11.5z" />
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
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-gray-700/80 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden flex flex-col bg-transparent">
          {/* Selector de prompts predefinidos */}
          <div className="p-3 border-b border-gray-700/50 bg-black/20">
            <SelectorPrompt onSelectPrompt={handleSeleccionPrompt} />
          </div>

          {/* Interfaz del chat */}
          <div className="flex-1 overflow-y-auto p-3">
            <InterfazChat 
              historialConsultas={historialConsultas}
              enviarConsulta={handleEnviarMensaje}
              isLoadingQuery={isLoadingQuery}
              statusIA={statusIA}
              ESTADOS_IA={ESTADOS_IA}
              mensaje={mensaje}
              setMensaje={setMensaje}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AsistenteIA;