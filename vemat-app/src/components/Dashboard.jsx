import { useState, useEffect } from "react";
import { generarDatos } from "../utils/generarDatos";
import CurrentReadings from "./CurrentReadings";
import ChartComponent from "./ChartComponent";
import HistoryTable from "./HistoryTable";
import MapView from "./MapView";

const LAT_DEFAULT = 10.43079;
const LON_DEFAULT = -85.08499;

export default function Dashboard() {
  const [lecturasActuales, setLecturasActuales] = useState(() => generarDatos());
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const now = new Date();
    const fechaHora = now.toLocaleString("es-CR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const primeraLectura = {
      fecha: fechaHora,
      ciudad: "Cañas",
      temperatura: Number(lecturasActuales.temperatura),
      humedad: Number(lecturasActuales.humedad),
      co2: Number(lecturasActuales.co2),
    };

    setHistorial([primeraLectura]);

    const intervalo = setInterval(() => {
      const datos = generarDatos();
      const fechaHora = new Date().toLocaleString("es-CR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const datosConCiudadFija = {
        ...datos,
        ciudad: "Cañas",
        fecha: fechaHora,
        temperatura: Number(datos.temperatura),
        humedad: Number(datos.humedad),
        co2: Number(datos.co2),
      };

      setLecturasActuales(datosConCiudadFija);
      setHistorial(prev => {
        const nuevoHistorial = [...prev, datosConCiudadFija];
        return nuevoHistorial.slice(-20); // mantener solo las últimas 20 lecturas
      });
    }, 60000); // cada 60 segundos

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <CurrentReadings datos={lecturasActuales} ciudad="Cañas" />
      <ChartComponent datos={historial} />
      <HistoryTable historial={historial} />
      <MapView latitude={LAT_DEFAULT} longitude={LON_DEFAULT} />
      
    </div>
  );
}
