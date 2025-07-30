// src/components/DeviceLocation.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir el ícono predeterminado para que se vea el marcador rojo
const redIcon = new L.Icon({
  iconUrl: 'https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=location|FF0000',
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [0, -50],
});

const DeviceLocation = () => {
  const position = [10.43079, -85.08499];

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold text-white mb-4">Ubicación del Dispositivo</h2>
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={redIcon}>
            <Popup>
              Dispositivo localizado aquí.<br />Lat: 10.43079<br />Lon: -85.08499
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default DeviceLocation;
