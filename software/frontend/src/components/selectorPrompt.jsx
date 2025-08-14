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
    <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Prompts Rápidos</h2>
      {todosLosPrompts.length === 0 && !loading && !error && (
        <p className="text-white">No se encontraron prompts sugeridos.</p>
      )}
      <div className="grid grid-cols-4 gap-3">
        {todosLosPrompts.map(prompt => (
          <button
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt)}
            className="flex items-center p-3 bg-ia-background rounded-lg shadow-sm hover:bg-ia-primary hover:text-white transition-colors duration-200 text-left"
          >
            <span className="text-xl mr-2">{getCategoryIcon(prompt.categoria)}</span>
            <span className="font-medium flex-grow">{prompt.titulo}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSelector;