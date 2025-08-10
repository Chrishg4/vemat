import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icono personalizado opcional
const iconoSensor = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function MapView({ coordenadas }) {
  if (!coordenadas || !coordenadas.lat || !coordenadas.lng) {
    console.warn("Coordenadas no definidas correctamente.");
    return <div>Error en mapa: coordenadas inválidas</div>;
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-white text-xl font-semibold mb-4">Ubicación del Sensor</h2>
      <div className="h-80 w-full rounded-xl overflow-hidden shadow-md">
        <MapContainer center={[coordenadas.lat, coordenadas.lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordenadas.lat, coordenadas.lng]} icon={iconoSensor}>
            <Popup>Sensor ambiental ubicado aquí</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="text-white text-sm mt-2 text-center">
        <p>Latitud: {coordenadas.lat.toFixed(5)}, Longitud: {coordenadas.lng.toFixed(5)}</p>
        <p>Ubicación: Universidad Tecnica Nacional</p>
      </div>
    </div>
  );
}
