
import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = ({
  enviarConsulta,
  isLoadingQuery,
  respuesta,
  historialConsultas,
  statusIA,
  ESTADOS_IA,
  onDescargarChat // Nueva prop
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
    <div className="bg-ia-background border-l-4 border-ia-primary p-4 my-4 rounded-lg shadow-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-2xl">🤖</span>
        </div>
        <div className="ml-3 w-full">
          <div className="text-sm text-ia-text whitespace-pre-wrap">
            {res.respuesta}
          </div>
          {res.contexto_usado && (
            <div className="mt-2 text-xs text-ia-text opacity-75">
              Basado en datos de: {res.contexto_usado.actual?.nodo_id || 'N/A'} - {new Date(res.timestamp).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md flex flex-col min-h-[400px] max-h-[calc(100vh-200px)]">
      <h2 className="text-xl font-semibold text-white mb-4">Conversación con el Asistente</h2>
      {/* Botón de descarga */}
      <div className="flex justify-start mb-4">
        <button
          onClick={onDescargarChat}
          className="px-6 py-3 rounded-lg bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition"
        >
          Descargar Chat
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 no-scrollbar">
        {historialConsultas.length === 0 && !respuesta && (
          <p className="text-white text-center opacity-75 mt-10">¡Hola! ¿En qué puedo ayudarte hoy? Puedes usar los prompts rápidos o escribir tu consulta.</p>
        )}

        {historialConsultas.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="bg-gray-700 border-l-4 border-blue-500 p-3 my-2 rounded-lg shadow-sm">
              <p className="font-semibold text-white">Tú:</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{item.pregunta}</p>
            </div>
            <RespuestaIA res={item.respuesta} />
          </div>
        ))}

        {isLoadingQuery && (
          <div className="text-white text-center my-4">
            <span className="animate-pulse">Analizando...</span>
          </div>
        )}

        {respuesta && !isLoadingQuery && historialConsultas.length === 0 && (
          <RespuestaIA res={respuesta} />
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center">
        <textarea
          className="flex-grow p-2 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-ia-primary resize-none bg-gray-700 text-white"
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
          className="px-6 py-2 bg-ia-primary text-white font-semibold rounded-r-md hover:bg-ia-text transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-full"
          onClick={handleSend}
          disabled={isLoadingQuery || !consulta.trim() || statusIA.estado === ESTADOS_IA.CARGANDO || statusIA.estado === ESTADOS_IA.ERROR}
        >
          {isLoadingQuery ? 'Enviando' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
