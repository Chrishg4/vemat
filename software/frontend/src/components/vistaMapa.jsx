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

export default function VistaMapa({ coordenadas, showCoords = true }) {
  if (!coordenadas || !coordenadas.lat || !coordenadas.lng) {
    console.warn("Coordenadas no definidas correctamente.");
    return <div>Error en mapa: coordenadas inválidas</div>;
  }

  return (
    <>
      <div className="h-full w-full rounded-lg overflow-hidden">
        <div className="h-80 w-full">
          <MapContainer center={[coordenadas.lat, coordenadas.lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
            <Marker position={[coordenadas.lat, coordenadas.lng]} icon={iconoSensor}>
              <Popup>Sensor ambiental ubicado aquí</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      {showCoords && (
        <div className="text-ia-text text-sm mt-2 text-center">
          <p>Latitud: {coordenadas.lat.toFixed(5)}, Longitud: {coordenadas.lng.toFixed(5)}</p>
          <p>Ubicación: Universidad Tecnica Nacional</p>
        </div>
      )}
    </>
  );
}
