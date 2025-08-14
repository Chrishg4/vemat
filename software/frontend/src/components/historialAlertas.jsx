// src/components/historialAlertas.jsx
import React from "react";

export default function HistorialAlertas({ alertas }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">Historial de Alertas</h2>
      {alertas.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No hay alertas registradas</p>
      ) : (
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-blue-400">
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Rango Normal</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {alertas.map((alerta, index) => {
              return (
                <tr key={index} className="text-center border-t border-gray-800 hover:bg-gray-800">
                  <td className="px-4 py-2 text-blue-400">{alerta.tipo}</td>
                  <td className="px-4 py-2 text-blue-400">
                    {alerta.valor}
                    {alerta.tipo === 'temperatura' ? '°C' : 
                     alerta.tipo === 'humedad' ? '%' : 
                     alerta.tipo === 'co2' ? ' ppm' : ''}
                  </td>
                  <td className="px-4 py-2">{alerta.rangoNormal}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alerta.estado === 'enviado' ? 'bg-green-500/20 text-green-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {alerta.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
