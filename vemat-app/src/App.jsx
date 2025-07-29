import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import CurrentReadings from './components/CurrentReadings';
import HistoryTable from './components/HistoryTable';
import ChartComponent from './components/ChartComponent';

function App() {
  const [currentData, setCurrentData] = useState({ temperature: 'N/A', humidity: 'N/A', co2: 'N/A' });
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], temperature: [], humidity: [] });

  const intervalRef = useRef(null);
  const historyCleanupIntervalRef = useRef(null);

  // Función para generar datos simulados
  const generarDatos = () => {
    const temperatura = (Math.random() * (30 - 15) + 15).toFixed(1); // Entre 15 y 30
    const humedad = Math.floor(Math.random() * (80 - 40) + 40); // Entre 40 y 80
    const co2 = Math.floor(Math.random() * (800 - 350) + 350); // Entre 350 y 800
    return { temperatura, humedad, co2, timestamp: new Date().toLocaleString() }; // Usar toLocaleString para formato más completo
  };

  // Función para agregar datos al historial y al gráfico
  const agregarDatos = (newDatos) => {
    setCurrentData({
      temperature: newDatos.temperatura,
      humidity: newDatos.humedad,
      co2: newDatos.co2,
    });

    setHistory(prevHistory => {
      const updatedHistory = [...prevHistory, newDatos];
      // Mantener un historial razonable, por ejemplo, los últimos 100 registros
      return updatedHistory.slice(Math.max(updatedHistory.length - 100, 0));
    });

    setChartData(prevChartData => {
      const newLabels = [...prevChartData.labels, newDatos.timestamp].slice(-10); // Últimos 10 puntos en el gráfico
      const newTempData = [...prevChartData.temperature, parseFloat(newDatos.temperatura)].slice(-10);
      const newHumData = [...prevChartData.humidity, parseFloat(newDatos.humedad)].slice(-10);
      return { labels: newLabels, temperature: newTempData, humidity: newHumData };
    });
  };

  // Función para limpiar el historial (ejemplo: mantener solo los datos de la última hora)
  const limpiarHistorial = () => {
    setHistory(prevHistory => {
      // Filtrar el historial para mantener solo los datos de la última hora
      const oneHourAgo = new Date().getTime() - (60 * 60 * 1000);
      const filteredHistory = prevHistory.filter(item => new Date(item.timestamp).getTime() > oneHourAgo);
      console.log("Historial de datos limpiado. Registros restantes:", filteredHistory.length);
      return filteredHistory;
    });

    setChartData(prevChartData => {
      // También limpiar datos del gráfico si los puntos ya son muy antiguos
      const oneHourAgo = new Date().getTime() - (60 * 60 * 1000);
      const newLabels = prevChartData.labels.filter(label => new Date(label).getTime() > oneHourAgo);
      const newTempData = prevChartData.temperature.filter((_, index) => new Date(prevChartData.labels[index]).getTime() > oneHourAgo);
      const newHumData = prevChartData.humidity.filter((_, index) => new Date(prevChartData.labels[index]).getTime() > oneHourAgo);
      return { labels: newLabels, temperature: newTempData, humidity: newHumData };
    });
  };

  useEffect(() => {
    // Primera carga de datos
    const initialData = generarDatos();
    agregarDatos(initialData);

    // Actualización de datos cada 1 minuto (60000 ms)
    intervalRef.current = setInterval(() => {
      const newDatos = generarDatos();
      agregarDatos(newDatos);
      console.log("Datos actualizados:", newDatos);
    }, 60000); // 1 minuto

    // Limpiar historial cada 5 minutos (5 * 60 * 1000 ms)
    historyCleanupIntervalRef.current = setInterval(limpiarHistorial, 5 * 60 * 1000); // 5 minutos

    // Función de limpieza al desmontar el componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (historyCleanupIntervalRef.current) {
        clearInterval(historyCleanupIntervalRef.current);
      }
    };
  }, []); // El array vacío asegura que useEffect se ejecute solo una vez al montar

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <CurrentReadings
            temperature={currentData.temperature}
            humidity={currentData.humidity}
            co2={currentData.co2}
          />
          <ChartComponent chartData={chartData} />
        </div>
        <HistoryTable history={history} />
      </main>
    </div>
  );
}

export default App;