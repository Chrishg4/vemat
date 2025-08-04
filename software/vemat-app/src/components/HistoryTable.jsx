import React from 'react';

function HistoryTable({ history }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl col-span-2"> {/* Abarca 2 columnas en el grid */}
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
        <span className="text-orange-400 text-2xl">📊</span>
        <span>Historial de Lecturas</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-600 text-gray-200 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Fecha/Hora</th>
              <th className="py-3 px-6 text-left">Temperatura (°C)</th>
              <th className="py-3 px-6 text-left">Humedad (%)</th>
              <th className="py-3 px-6 text-left">CO₂ (ppm)</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 text-sm font-light">
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 px-6 text-center italic">No hay datos en el historial aún.</td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr key={index} className="border-b border-gray-600 hover:bg-gray-700">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{item.timestamp}</td>
                  <td className="py-3 px-6 text-left">{item.temperatura}</td>
                  <td className="py-3 px-6 text-left">{item.humedad}</td>
                  <td className="py-3 px-6 text-left">{item.co2}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;