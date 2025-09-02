
import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = ({
  enviarConsulta,
  isLoadingQuery,
  respuesta,
  historialConsultas = [],
  statusIA,
  ESTADOS_IA
}) => {
  const [consulta, setConsulta] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [historialConsultas, respuesta]);

  const handleSend = () => {
    enviarConsulta(consulta);
    setConsulta(''); // Limpiar el input después de enviar
  };

  const RespuestaIA = ({ res }) => (
    <div className="bg-black/10 border border-ia-primary/30 p-3 my-2 rounded-lg shadow-md flex items-start space-x-3">
      <span className="text-xl opacity-80">🤖</span>
      <div className="w-full">
        <div className="text-sm text-gray-300 whitespace-pre-wrap">
          {res.mensaje}
        </div>
        {res.contexto_usado && (
          <div className="mt-2 text-xs text-gray-500">
            Basado en datos de: {res.contexto_usado.actual?.nodo_id || 'N/A'} - {new Date(res.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-transparent flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2 no-scrollbar">
        {historialConsultas.length === 0 && !respuesta && (
          <p className="text-gray-400 text-center opacity-75 mt-4 text-sm">¡Hola! ¿En qué puedo ayudarte hoy? Puedes usar los prompts rápidos o escribir tu consulta.</p>
        )}

        {historialConsultas.map((item, index) => {
          if (item.tipo === 'usuario') {
            return (
              <div key={index} className="bg-blue-500/10 border border-blue-500/30 p-2 my-2 rounded-lg shadow-sm">
                <p className="font-semibold text-blue-300 text-sm">Tú:</p>
                <p className="text-xs text-gray-300 whitespace-pre-wrap">{item.mensaje}</p>
              </div>
            );
          }
          if (item.tipo === 'asistente') {
            return <RespuestaIA key={index} res={item} />;
          }
          if (item.tipo === 'error') {
            return (
              <div key={index} className="bg-red-800/50 border border-red-500/50 p-2 my-2 rounded-lg shadow-sm">
                <p className="font-semibold text-white">Error:</p>
                <p className="text-xs text-gray-300 whitespace-pre-wrap">{item.mensaje}</p>
              </div>
            );
          }
          return null;
        })}

        {isLoadingQuery && (
          <div className="text-center my-4 flex justify-center items-center space-x-2">
            <span className="text-gray-400">Analizando...</span>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-300"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-2 flex items-center">
        <textarea
          className="flex-grow p-2 border border-gray-700/50 rounded-l-md focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none bg-black/20 text-white text-sm"
          rows="1"
          placeholder="Escribe tu consulta aquí..."
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoadingQuery || statusIA.estado === ESTADOS_IA.CARGANDO || statusIA.estado === ESTADOS_IA.ERROR}
        ></textarea>
        <button
          className="px-5 py-3 bg-sky-500/50 text-white font-semibold rounded-r-lg hover:bg-sky-500/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-full text-sm flex items-center justify-center"
          onClick={handleSend}
          disabled={isLoadingQuery || !consulta.trim() || statusIA.estado === ESTADOS_IA.CARGANDO || statusIA.estado === ESTADOS_IA.ERROR}
        >
          {isLoadingQuery ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
