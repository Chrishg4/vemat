import React, { useState } from "react";
import GraficoTempHumedad from "../components/graficoTempHumedad";
import { useContextoTablero } from "../context/contextoTablero";

export default function PaginaGraficoTempHumedad() {
  const { data } = useContextoTablero();
  const [chartMode, setChartMode] = useState('line'); // Estado para el modo del gráfico

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-white text-2xl font-bold mb-4">Gráfica de Datos Históricos</h2>
      <div className="flex justify-end mb-4">
        <select
          value={chartMode}
          onChange={(e) => setChartMode(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="line">Líneas</option>
          <option value="bar">Barras</option>
          <option value="area">Área</option>
        </select>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
  <GraficoTempHumedad chartMode={chartMode} data={data} />
      </div>
    </div>
  );
}
