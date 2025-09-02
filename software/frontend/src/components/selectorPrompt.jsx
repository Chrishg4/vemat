import React, { useState, useEffect } from 'react';
import useServicioIA from '../hooks/useServicioIA';

const PromptSelector = ({ onSelectPrompt }) => {
  const { obtenerPromptsSugeridos, loading, error } = useServicioIA();
  const [todosLosPrompts, setTodosLosPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await obtenerPromptsSugeridos();
        if (data.success) {
          // Aplanamos el objeto de prompts por categoría en una sola lista
          const promptsAplanados = Object.values(data.por_categoria).flat();
          setTodosLosPrompts(promptsAplanados);
        }
      } catch (err) {
        console.error("Error fetching prompts:", err);
      }
    };
    fetchPrompts();
  }, [obtenerPromptsSugeridos]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Análisis': return '';
      case 'Predicción': return '';
      case 'Recomendaciones': return '';
      case 'Evaluación': return '';
      case 'Alertas': return '';
      case 'Histórico': return '';
      case 'Correlación': return '';
      default: return '📄';
    }
  };

  if (loading) return <div className="text-ia-text">Cargando prompts...</div>;
  if (error) return <div className="text-ia-danger">Error al cargar prompts: {error}</div>;

  return (
    <div className="bg-transparent">
      <h3 className="text-base font-semibold text-sky-300 mb-3">Prompts Rápidos</h3>
      {todosLosPrompts.length === 0 && !loading && !error && (
        <p className="text-gray-400 text-sm">No se encontraron prompts sugeridos.</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {todosLosPrompts.map(prompt => (
          <button
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt)}
            className="flex items-center p-2 bg-black/20 border border-gray-700/50 rounded-lg shadow-sm hover:bg-sky-500/30 transition-colors duration-200 text-left"
          >
            <span className="text-base mr-2">{getCategoryIcon(prompt.categoria)}</span>
            <span className="text-sm font-light text-gray-300 flex-grow">{prompt.titulo}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSelector;