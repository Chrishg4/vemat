// src/use/useGetSoundHistory.js
import { useState, useEffect } from 'react';
import { getAllReadings } from '../services/readingsService';
import { useErrorHandler } from '../hooks/useErrorHandler';

export const useGetAcusticaHistory = () => {
  const [soundHistory, setSoundHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error, handleApiError, clearError } = useErrorHandler();

  const fetchSoundHistory = async () => {
    clearError();
    setLoading(true);
    
    try {
      const readings = await getAllReadings();
      if (Array.isArray(readings)) {
        const history = readings.map(reading => ({
          fecha: reading.fecha,
          acustica: reading.sonido
        }));
        setSoundHistory(history);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoundHistory();
  }, []);

  return {
    soundHistory,
    loading,
    error,
    refreshSoundHistory: fetchSoundHistory
  };
};
