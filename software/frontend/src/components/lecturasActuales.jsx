import React, { useState } from 'react'
import { useContextoTablero } from '../context/contextoTablero'
import { sendAlertEmail } from '../services/servicioAlertas'
import { MdCheckCircle, MdError, MdInfo } from 'react-icons/md'

export default function CurrentReadings() {
  const { latest, loading, data } = useContextoTablero();
  const [alertStatus, setAlertStatus] = useState(null);
  const [sending, setSending] = useState(false);

  if (loading) return <p className="text-white">Cargando datos...</p>;
  if (!latest || Object.keys(latest).length === 0) return <p className="text-white">No hay datos disponibles.</p>;

  // Función para enviar alerta
  const handleSendAlert = async () => {
    setSending(true);
    setAlertStatus(null);
    const result = await sendAlertEmail(latest, data);
    setAlertStatus(result);
    setSending(false);
  };

  return (
    <div className="bg-gray-900 px-4 pt-4 pb-2 rounded-xl shadow-lg border border-gray-800 w-full">
      <h2 className="text-xl font-semibold mb-2 text-white">Lecturas Actuales</h2>
      <div className="flex flex-col space-y-2">
        {latest.nodo_id && (
          <p><span className="text-blue-400 font-semibold">ID de Nodo:</span> <span className="text-gray-300 text-xl">{latest.nodo_id}</span></p>
        )}
        {latest.fecha && (
          <p><span className="text-blue-400 font-semibold">Fecha:</span> <span className="text-gray-300 text-xl">{new Date(latest.fecha).toLocaleString('es-CR', { timeZone: 'UTC' })}</span></p>
        )}
        <p><span className="text-blue-400 font-semibold">Temperatura:</span> <span className="text-gray-300 text-xl">{latest.temperatura} °C</span></p>
        <p><span className="text-blue-400 font-semibold">Humedad:</span> <span className="text-gray-300 text-xl">{latest.humedad} %</span></p>
        <p><span className="text-blue-400 font-semibold">CO₂:</span> <span className="text-gray-300 text-xl">{latest.co2} ppm</span></p>
        <p><span className="text-blue-400 font-semibold">Bioacustica:</span> <span className="text-gray-300 text-xl">{latest.acustica} Hz</span></p>
        <p>
          <span className="text-blue-400 font-semibold">Latitud:</span> <span className="text-gray-300 text-xl">{latest.latitud !== undefined ? latest.latitud.toFixed(5) : 'N/A'}</span>
        </p>
        <p>
          <span className="text-blue-400 font-semibold">Longitud:</span> <span className="text-gray-300 text-xl">{latest.longitud !== undefined ? latest.longitud.toFixed(5) : 'N/A'}</span>
        </p>
      </div>
      <div className="mt-4 flex flex-col items-start">
        <button
          className={`px-4 py-2 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSendAlert}
          disabled={sending}
        >
          {sending ? 'Enviando alerta...' : 'Enviar alerta por correo'}
        </button>
        {alertStatus && (
          <div className="mt-3 flex items-center space-x-2">
            {alertStatus.status === 'success' && <MdCheckCircle className="text-green-500 text-2xl" />}
            {alertStatus.status === 'error' && <MdError className="text-red-500 text-2xl" />}
            {alertStatus.status === 'already-sent' && <MdInfo className="text-yellow-400 text-2xl" />}
            {alertStatus.status === 'no-alert' && <MdInfo className="text-blue-400 text-2xl" />}
            <span className="text-white font-semibold">{alertStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
