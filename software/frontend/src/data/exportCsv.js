// Utilidad para convertir un array de objetos a CSV y descargarlo en el navegador.
// Maneja arrays/objetos anidados convirtiéndolos a JSON o a cadenas separadas por '|'.
export function arrayToCsv(rows, columns) {
  if (!Array.isArray(rows) || rows.length === 0) return '';

  // Si no se proveen columnas, inferir a partir de la primera fila (propiedades top-level)
  const cols = Array.isArray(columns) && columns.length > 0
    ? columns
    : Object.keys(rows[0]);

  const escapeCell = (value) => {
    if (value === null || value === undefined) return '';
    // Para arrays u objetos, convertir a string legible
    if (Array.isArray(value)) return value.join('|');
    if (typeof value === 'object') return JSON.stringify(value);
    // Convertir a string y escapar comillas dobles
    const str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const header = cols.join(',');
  const lines = rows.map(row => {
    return cols.map(col => escapeCell(row[col])).join(',');
  });

  return [header, ...lines].join('\n');
}

export function downloadCsvFile(filename, rows, columns) {
  const csv = arrayToCsv(rows, columns);
  // Añadir BOM para soportar caracteres UTF-8 correctamente en Excel
  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE 10+
    window.navigator.msSaveBlob(blob, filename);
    return;
  }
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

// Export por defecto utilidades
export default {
  arrayToCsv,
  downloadCsvFile
};
