// src/App.jsx
import React, { useState, useEffect } from 'react';
import './index.css'; // Asegúrate de que esta ruta sea correcta a tu archivo global de estilos Tailwind

// Importa los componentes del layout
import Header from './components/Header';
import CurrentReadings from './components/CurrentReadings';
import TempHumidityChart from './components/TempHumidityChart';
import ReadingsTable from './components/ReadingsTable';
import MapView from './components/MapView';

// Importa los componentes y el contexto de autenticación
import LoginForm from './components/LoginForm';
import { AuthProvider, useAuth } from './components/AuthContext';

// --- Constantes para la ubicación fija del dispositivo (Cañas, Guanacaste) ---
const CANAS_LATITUDE = 10.43079;
const CANAS_LONGITUDE = -85.08499;

// --- Función para generar datos simulados ---
const generateRandomData = () => {
  const now = new Date();
  // Formato de fecha y hora para coincidir con la imagen ("dd/mm/yyyy, hh:mm:ss a. m./p. m.")
  const formattedDate = now.toLocaleDateString('es-CR', { //
    day: '2-digit', month: '2-digit', year: 'numeric' //
  });
  const formattedTime = now.toLocaleTimeString('es-CR', { //
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true //
  });
  const dateTime = `${formattedDate}, ${formattedTime}`; //

  return {
    date: dateTime,
    temperatura: (Math.random() * (30 - 15) + 15).toFixed(1), // entre 15 y 30
    humedad: (Math.random() * (80 - 40) + 40).toFixed(0),     // entre 40 y 80
    co2: (Math.random() * (800 - 350) + 350).toFixed(0),      // entre 350 y 800
    city: Math.random() > 0.5 ? 'Cañas' : 'Cañas',          // Ciudad aleatoria
    latitude: 0, // Placeholder, ya que MapView usa constantes fijas
    longitude: 0, // Placeholder
  };
};


// Componente que contiene el Dashboard real, visible solo después del login
const DashboardContent = () => {
  const { logout } = useAuth(); // Obtiene la función de logout del contexto de autenticación

  // Estados para los datos del dashboard
  const [currentReadings, setCurrentReadings] = useState(() => generateRandomData()); // Datos de la lectura actual
  const [historyData, setHistoryData] = useState([]); // Historial de lecturas para la tabla
  const [chartData, setChartData] = useState({ labels: [], temperatures: [], humidities: [] }); // Datos para la gráfica
  // Estado para la ubicación del dispositivo, usando las coordenadas fijas de Cañas
  const [deviceLocation, setDeviceLocation] = useState({ latitude: CANAS_LATITUDE, longitude: CANAS_LONGITUDE }); //

  useEffect(() => {
    // Inicializar el historial y la gráfica con los primeros datos al cargar el componente
    const initialData = generateRandomData(); //
    setCurrentReadings(initialData); // Asegurarse de que la lectura actual refleje la primera generada
    // Aquí se corrige: ahora se pasan todos los datos de `initialData` al historial.
    setHistoryData([initialData]); // Añadir la primera lectura al historial

    // Aquí se corrige: se usan temperatura y humedad de `initialData` para la gráfica.
    setChartData({
      labels: [initialData.date], //
      temperatures: [parseFloat(initialData.temperatura)], //
      humidities: [parseFloat(initialData.humedad)], //
    });
    // La ubicación del dispositivo permanece fija, ya que el Arduino no se mueve en este escenario
    setDeviceLocation({ latitude: CANAS_LATITUDE, longitude: CANAS_LONGITUDE }); //

    // Configurar el intervalo para generar nuevos datos cada minuto
    const interval = setInterval(() => { //
      const newData = generateRandomData(); //
      setCurrentReadings(newData); // Actualiza la lectura actual

      // Añadir la nueva lectura al principio del historial (más reciente arriba)
      // Se limita el historial a las últimas 20 entradas para no acumular demasiados datos
      // Aquí se corrige: se pasa el objeto `newData` completo.
      setHistoryData(prevHistory => { //
        const updatedHistory = [newData, ...prevHistory]; //
        return updatedHistory.slice(0, 20); // Mantiene las últimas 20 lecturas
      });

      // Actualizar los datos de la gráfica
      // Se mantienen solo los últimos 10 puntos en la gráfica para que no se extienda demasiado
      // Aquí se corrige: se usan temperatura y humedad de `newData` para la gráfica.
      setChartData(prevChartData => { //
        const newLabels = [...prevChartData.labels, newData.date].slice(-10); // Últimos 10 puntos para las etiquetas
        const newTemps = [...prevChartData.temperatures, parseFloat(newData.temperatura)].slice(-10); // Últimos 10 puntos de temperatura
        const newHumids = [...prevChartData.humidities, parseFloat(newData.humedad)].slice(-10); // Últimos 10 puntos de humedad
        return { labels: newLabels, temperatures: newTemps, humidities: newHumids }; //
      });

    }, 60 * 1000); // El intervalo se ejecuta cada 60 segundos (1 minuto)

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    // Esto es crucial para evitar fugas de memoria y errores
    return () => clearInterval(interval); //
  }, []); // El array de dependencias vacío asegura que este useEffect se ejecute solo una vez al montar

  return (
    <div className="min-h-screen bg-gray-900 font-sans antialiased text-gray-100">
      <Header /> {/* Componente de la barra de navegación superior */}

      {/* Botón para cerrar sesión, posicionado de forma fija en la esquina superior derecha */}
      <button
        onClick={logout}
        className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm z-50 transition duration-300 ease-in-out"
      >
        Cerrar Sesión
      </button>

      <main className="p-4 md:p-8"> {/* Contenedor principal para el contenido del dashboard */}
        {/* Sección superior: Lecturas Actuales y Gráfica */}
        {/* Usamos grid para organizar estos dos componentes en 1 columna en móviles y 2 en pantallas grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <CurrentReadings data={currentReadings} />
          </div>
          <div>
            <TempHumidityChart chartData={chartData} />
          </div>
        </div>

        {/* Sección inferior: Mapa de Ubicación y Tabla de Historial */}
        {/* Otra grid para organizar el mapa y la tabla */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Componente del Mapa, al que le pasamos las coordenadas fijas */}
          <MapView latitude={deviceLocation.latitude} longitude={deviceLocation.longitude} />

          {/* Componente de la Tabla de Historial */}
          <ReadingsTable historyData={historyData} />
        </div>
      </main>
    </div>
  );
};

// Componente principal de la aplicación
function App() {
  return (
    // Envuelve toda la aplicación con AuthProvider para que el contexto de autenticación esté disponible
    <AuthProvider>
      <AppContent /> {/* Componente que decide si mostrar el login o el dashboard */}
    </AuthProvider>
  );
}

// Componente que usa el contexto de autenticación para decidir qué renderizar
function AppContent() {
  const { isAuthenticated } = useAuth(); // Obtiene el estado de autenticación

  // Si el usuario está autenticado, muestra el Dashboard; de lo contrario, muestra el formulario de Login
  return isAuthenticated ? <DashboardContent /> : <LoginForm />;
}

export default App;