import React from "react";
import { useContextoTablero } from "../context/contextoTablero";

export default function TablaLecturas({ limit, showTitle = true, title = "Historial de Lecturas" }) {
  // Función para descargar los datos filtrados como CSV
  const descargarCSV = () => {
    if (!datosFiltrados.length) return;
    const encabezados = [
      'Fecha', 'ID de Nodo', 'Temperatura', 'Humedad', 'CO₂', 'Bioacústica', 'Ciudad'
    ];
    // Usar punto y coma como delimitador para compatibilidad con Excel en español
    const delimiter = ';';
    const filas = datosFiltrados.map(lectura => [
      new Date(lectura.fecha).toLocaleString('es-CR', { timeZone: 'UTC' }),
      lectura.nodo_id,
      `${lectura.temperatura} °C`,
      `${lectura.humedad} %`,
      `${lectura.co2} ppm`,
      `${lectura.acustica} Hz`,
      'Cañas'
    ].map(valor => {
      // Eliminar solo caracteres de control, permitir ñ y tildes
      return String(valor).replace(/[\u0000-\u001f\u007f]/g, '');
    }));
    // Agregar BOM para que Excel reconozca UTF-8
    const BOM = '\uFEFF';
    const csvContent = BOM + [
      encabezados.join(delimiter),
      ...filas.map(fila => fila.join(delimiter))
    ].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let nombre = 'lecturas';
    if (filtroTipo === 'dia' && filtroValor) nombre += `_dia_${filtroValor}`;
    else if (filtroTipo === 'mes' && filtroValor) nombre += `_mes_${filtroValor}`;
    else if (filtroTipo === 'anio' && filtroValor) nombre += `_anio_${filtroValor}`;
    else nombre += '_todas';
    link.download = `${nombre}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const { data } = useContextoTablero();
  const [paginaActual, setPaginaActual] = React.useState(1);
  const [filtroTipo, setFiltroTipo] = React.useState('todos');
  const [filtroValor, setFiltroValor] = React.useState('');

  if (!data || data.length === 0) {
    return <p className="text-white">Cargando historial...</p>;
  }

  // Filtrado
  let datosFiltrados = [...data];
  if (filtroTipo !== 'todos' && filtroValor) {
    datosFiltrados = datosFiltrados.filter((lectura) => {
      const fechaLectura = new Date(lectura.fecha);
      if (filtroTipo === 'dia') {
        const fechaLecturaStr = fechaLectura.toLocaleDateString('en-CA', { timeZone: 'UTC' });
        return fechaLecturaStr === filtroValor;
      }
      if (filtroTipo === 'mes') {
        const [anio, mes] = filtroValor.split('-');
        return fechaLectura.getUTCFullYear() === Number(anio) && (fechaLectura.getUTCMonth() + 1) === Number(mes);
      }
      if (filtroTipo === 'anio') {
        return fechaLectura.getUTCFullYear() === Number(filtroValor);
      }
      return true;
    });
  }

  // Paginación
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(datosFiltrados.length / registrosPorPagina);
  const datosPagina = datosFiltrados.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);

  const handleFiltroTipo = (e) => {
    setFiltroTipo(e.target.value);
    setFiltroValor('');
    setPaginaActual(1);
  };
  const handleFiltroValor = (e) => {
    setFiltroValor(e.target.value);
    setPaginaActual(1);
  };
  const handlePagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        {showTitle && (
          <h2 className="text-white text-2xl font-bold tracking-wide">
            {title}
          </h2>
        )}
        <button
          className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition"
          onClick={descargarCSV}
        >Descargar CSV</button>
      </div>
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-gray-400 font-semibold mr-2">Filtrar por:</span>
        <button
          className={`px-3 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow ${filtroTipo === 'todos' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-cyan-300 hover:bg-cyan-700'}`}
          onClick={() => { setFiltroTipo('todos'); setFiltroValor(''); setPaginaActual(1); }}
        >Todos</button>
        <button
          className={`px-3 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow ${filtroTipo === 'dia' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-cyan-300 hover:bg-cyan-700'}`}
          onClick={() => { setFiltroTipo('dia'); setFiltroValor(''); setPaginaActual(1); }}
        >Día</button>
        <button
          className={`px-3 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow ${filtroTipo === 'mes' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-cyan-300 hover:bg-cyan-700'}`}
          onClick={() => { setFiltroTipo('mes'); setFiltroValor(''); setPaginaActual(1); }}
        >Mes</button>
        <button
          className={`px-3 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow ${filtroTipo === 'anio' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-cyan-300 hover:bg-cyan-700'}`}
          onClick={() => { setFiltroTipo('anio'); setFiltroValor(''); setPaginaActual(1); }}
        >Año</button>
        {filtroTipo === 'dia' && (
          <input type="date" value={filtroValor} onChange={handleFiltroValor} className="bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-cyan-400 ml-2" />
        )}
        {filtroTipo === 'mes' && (
          <input type="month" value={filtroValor} onChange={handleFiltroValor} className="bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-cyan-400 ml-2" />
        )}
        {filtroTipo === 'anio' && (
          <input type="number" min="2000" max="2100" value={filtroValor} onChange={handleFiltroValor} className="bg-gray-800 text-white px-3 py-2 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-cyan-400 ml-2" placeholder="Año" />
        )}
        {filtroTipo !== 'todos' && filtroValor && (
          <span className="bg-cyan-700 text-white px-2 py-1 rounded-lg ml-2 font-semibold flex items-center gap-1">
            <span>Filtro:</span>
            <span>{
              filtroTipo === 'dia'
                ? filtroValor.split('-').reverse().join('/')
                : filtroValor
            }</span>
            <button className="ml-1 text-xs px-2 py-0.5 bg-gray-800 rounded hover:bg-red-600 transition" onClick={() => setFiltroValor('')}>✕</button>
          </span>
        )}
      </div>
      <div className="overflow-auto rounded-xl border border-gray-700">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-5 py-4 text-left text-cyan-400 font-semibold">Fecha</th>
              <th className="px-5 py-4 text-left text-cyan-400 font-semibold">ID de Nodo</th>
              <th className="px-5 py-4 text-left text-cyan-400 font-semibold">Temperatura</th>
              <th className="px-5 py-4 text-left text-cyan-400 font-semibold">Humedad</th>
              <th className="px-5 py-4 text-left text-cyan-400 font-semibold">CO₂</th>
              <th className="px-5 py-4 text-left text-cyan-400 font-semibold">Bioacústica</th>
              <th className="px-5 py-4 text-left text-cyan-400 font-semibold">Ciudad</th>
            </tr>
          </thead>
          <tbody>
            {datosPagina.map((lectura, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-900 transition duration-150"
              >
                <td className="px-5 py-3 whitespace-nowrap text-gray-200 font-medium">{new Date(lectura.fecha).toLocaleString('es-CR', { timeZone: 'UTC' })}</td>
                <td className="px-5 py-3 whitespace-nowrap text-cyan-300 font-semibold">{lectura.nodo_id}</td>
                <td className="px-5 py-3 whitespace-nowrap text-orange-300 font-semibold">{lectura.temperatura} °C</td>
                <td className="px-5 py-3 whitespace-nowrap text-blue-300 font-semibold">{lectura.humedad} %</td>
                <td className="px-5 py-3 whitespace-nowrap text-green-300 font-semibold">{lectura.co2} ppm</td>
                <td className="px-5 py-3 whitespace-nowrap text-purple-300 font-semibold">{lectura.acustica} Hz</td>
                <td className="px-5 py-3 whitespace-nowrap text-gray-300">Cañas</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center items-center mt-6 gap-3">
        <button
          className="px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold shadow disabled:opacity-50 hover:bg-cyan-700 transition"
          onClick={() => handlePagina(paginaActual - 1)}
          disabled={paginaActual === 1}
        >Anterior</button>
        <span className="text-white font-semibold">Página {paginaActual} de {totalPaginas}</span>
        <button
          className="px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold shadow disabled:opacity-50 hover:bg-cyan-700 transition"
          onClick={() => handlePagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
        >Siguiente</button>
      </div>
    </div>
  );
}