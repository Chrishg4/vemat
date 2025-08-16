import React from "react";

export default function HistoryTable({ historial }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full bg-white text-sm text-left">
        <thead className="bg-green-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="py-3 px-4">Fecha</th>
            <th className="py-3 px-4">Ciudad</th>
            <th className="py-3 px-4">Temperatura (°C)</th>
            <th className="py-3 px-4">Humedad (%)</th>
            <th className="py-3 px-4">CO₂ (ppm)</th>
          </tr>
        </thead>
        <tbody>
          {[...historial].reverse().map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100 transition"
            >
              <td className="py-2 px-4">{item.fecha}</td>
              <td className="py-2 px-4">{item.ciudad}</td>
              <td className="py-2 px-4">{item.temperatura}</td>
              <td className="py-2 px-4">{item.humedad}</td>
              <td className="py-2 px-4">{item.co2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
