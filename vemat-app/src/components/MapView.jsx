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
    <div className="h-64 w-full rounded-xl overflow-hidden shadow-md">
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
  );
}
