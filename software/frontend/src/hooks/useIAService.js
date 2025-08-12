
import { useState, useCallback } from 'react';

const useIAService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const consultarIA = useCallback(async (prompt, incluirContexto = true, nodoId = null) => {
    setLoading(true);
    setError(null);
    try {
      const body = { prompt, incluir_contexto: incluirContexto };
      if (nodoId) {
        body.nodo_id = nodoId;
      }

      const response = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al consultar la IA');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerPromptsSugeridos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al obtener prompts sugeridos');
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verificarStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al verificar el estado de la IA');
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { consultarIA, obtenerPromptsSugeridos, verificarStatus, loading, error };
};

export default useIAService;
