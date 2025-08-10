import React from "react";
import TempHumidityChart from "../components/TempHumidityChart";

export default function TempHumidityChartPage() {
  const dummyChartData = {
    labels: ["14:00", "15:00", "16:00", "17:00"],
    datasets: [
      {
        label: "Temperatura (°C)",
        data: [25.4, 26.1, 27.3, 26.7],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Humedad (%)",
        data: [75, 78, 72, 74],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Temperatura y Humedad</h2>
      <TempHumidityChart data={dummyChartData} />
    </div>
  );
}
