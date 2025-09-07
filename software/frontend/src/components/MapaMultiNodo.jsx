import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Arreglo para el icono que no aparece en Leaflet con Webpack ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const useObtenerAlertasHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch alert history
        const alertsResponse = await fetch('https://vemat.onrender.com/api/alertas/history');
        const alertsData = await alertsResponse.json();
        const last3Alerts = alertsData.alerts.slice(0, 3);

        // 2. Fetch node coordinates
        const lecturasResponse = await fetch('https://vemat.onrender.com/api/datosLectura?limit=1000');
        const lecturasData = await lecturasResponse.json();
        
        const nodeCoordinates = {};
        lecturasData.data.forEach(lectura => {
          if (!nodeCoordinates[lectura.nodo_id]) {
            nodeCoordinates[lectura.nodo_id] = {
              lat: parseFloat(lectura.latitud),
              lng: parseFloat(lectura.longitud),
            };
          }
        });

        // 3. Process alerts to create heatmap data
        const processedData = last3Alerts.map(alert => {
          const coordinates = nodeCoordinates[alert.nodo_id];
          if (!coordinates) {
            return null;
          }

          // Extract CO2 value from details string
          const co2Match = alert.detalles.match(/CO2: (\d+\.?\d*)ppm/);
          const co2Value = co2Match ? parseFloat(co2Match[1]) : 0;

          return {
            ...coordinates,
            value: co2Value,
          };
        }).filter(Boolean); // Filter out nulls

        setHeatmapData(processedData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setHeatmapData([]);
      }
    };

    fetchData();
    // Daily update can be implemented with a setInterval or a more sophisticated mechanism
    const interval = setInterval(fetchData, 24 * 60 * 60 * 1000); // Update every 24 hours
    return () => clearInterval(interval);
  }, []);

  return { heatmapData, error };
};

const MapaMultiNodo = () => {
  const { heatmapData, error } = useObtenerAlertasHeatmap();
  const [maxCO2, setMaxCO2] = useState(200); // Default max for alerts

  useEffect(() => {
    if (heatmapData.length > 0) {
      const maxValor = Math.max(...heatmapData.map(d => d.value));
      setMaxCO2(Math.ceil(maxValor / 50) * 50); // Round up to the next 50
    }
  }, [heatmapData]);

  const centroMapa = [10.43079, -85.08499];

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }} className="bg-ia-card rounded-xl p-4">
      {error && (
        <div className="absolute top-4 left-4 z-[1000] bg-ia-error p-2 rounded-lg text-ia-text text-sm">
          Error: {error}
        </div>
      )}
      
      {heatmapData.length === 0 && !error && (
        <div className="absolute top-4 left-4 z-[1000] bg-ia-warning p-2 rounded-lg text-ia-text text-sm">
          No hay alertas recientes para mostrar en el mapa de calor.
        </div>
      )}
      
      {/* Leyenda del mapa de calor */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-ia-card-secondary p-2 rounded-lg border border-ia-border">
        <div className="text-ia-text text-sm">
          <p className="font-semibold mb-1">Niveles de Amenaza (CO2 ppm)</p>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-4 bg-gradient-to-r from-yellow-500 to-red-500 rounded"></div>
            <div className="flex justify-between w-full">
              <span>Bajo</span>
              <span>Alto</span>
            </div>
          </div>
        </div>
      </div>

      <MapContainer 
        center={centroMapa} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />

        <HeatmapLayer
          points={heatmapData}
          longitudeExtractor={p => p.lng}
          latitudeExtractor={p => p.lat}
          intensityExtractor={p => p.value}
          max={maxCO2}
          radius={50}
          blur={30}
          minOpacity={0.5}
        />
      </MapContainer>
    </div>
  );
};

export default MapaMultiNodo;
