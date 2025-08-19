// src/components/historialAlertas.jsx
import React from "react";
import UbicacionFromCoordenadas from "./ubicacióndeCoordenadas";

export default function HistorialAlertas({ alertas }) {
  const alertasArray = Array.isArray(alertas) ? alertas : [];
  // Paginación
  const [pagina, setPagina] = React.useState(1);
  const porPagina = 10;
        const totalPaginas = Math.ceil(alertasArray.length / porPagina); 
        const alertasPaginadas = alertasArray.slice((pagina - 1) * porPagina, pagina * porPagina); 

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">Historial de Alertas</h2>
      {alertasArray.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No hay alertas registradas</p>
      ) : (
        <>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-blue-400">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nodo</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Detalles</th>
                      <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {alertasPaginadas.map((alerta) => (
              <tr key={alerta.id} className="text-center border-t border-gray-800 hover:bg-gray-800">
                <td className="px-4 py-2 text-blue-400">{alerta.id}</td>
                <td className="px-4 py-2">{alerta.nodo_id}</td>
                <td className="px-4 py-2">{new Date(alerta.fecha_envio).toLocaleString('es-CR')}</td>
                <td className="px-4 py-2">{alerta.tipo}</td>
                <td className="px-4 py-2">{alerta.detalles}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">enviada</span>
                        </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Controles de paginación */}
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
          >Anterior</button>
          <span className="text-white">Página {pagina} de {totalPaginas}</span>
          <button
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
          >Siguiente</button>
        </div>
        </>
      )}
    </div>
  );
}
