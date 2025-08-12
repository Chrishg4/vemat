// src/use/useGetSound.js
import { useState, useEffect } from 'react';
import { getLatestReading } from '../services/readingsService';
import { useErrorHandler } from '../hooks/useErrorHandler';

export const useGetAcustica = (autoRefresh = true, refreshInterval = 5000) => {
  const [sound, setSound] = useState(0);
  const [loading, setLoading] = useState(false);
  const { error, handleApiError, clearError } = useErrorHandler();

  const fetchData = async () => {
    clearError();
    setLoading(true);
    
    try {
      const latestReading = await getLatestReading();
      
      if (latestReading && typeof latestReading.sonido !== 'undefined') {
        setSound(latestReading.sonido);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  return {
    sound,
    loading,
    error,
    refreshData: fetchData
  };
};
