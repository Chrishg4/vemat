import React from 'react';
import { mosquitoData } from '../data/mosquitoData';
import { downloadCsvFile } from '../data/exportCsv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DownloadMosquitoData({ fields }) {
  const handleDownloadCsv = () => {
    const filename = `mosquito_data_${new Date().toISOString().slice(0, 10)}.csv`;
    if (Array.isArray(fields) && fields.length > 0) {
      const filtered = mosquitoData.map(item => {
        const obj = {};
        fields.forEach(key => { obj[key] = item[key]; });
        return obj;
      });
      downloadCsvFile(filename, filtered, fields);
      return;
    }
    downloadCsvFile(filename, mosquitoData);
  };

  const handleDownloadPdf = () => {
    if (!Array.isArray(mosquitoData) || mosquitoData.length === 0) {
      alert('No hay datos disponibles para exportar a PDF.');
      return;
    }

    // Usar todas las claves del objeto para mostrar toda la info
    const headers = Array.isArray(fields) && fields.length > 0 ? fields : Object.keys(mosquitoData[0]);
    const body = mosquitoData.map(item => {
      return headers.map(h => {
        const v = item[h];
        if (v === null || v === undefined) return '';
        // Formatear arrays de strings
        if (Array.isArray(v) && typeof v[0] === 'string') return v.join(', ');
        // Formatear arrays de objetos (ej: diseases)
        if (Array.isArray(v) && typeof v[0] === 'object') {
          // Para diseases, mostrar nombre y costo, cada enfermedad en línea separada
          return v.map(d => `${d.name}${d.treatmentCost ? `\n  - ${d.treatmentCost}` : ''}`).join('\n');
        }
        // Formatear objetos simples
        if (typeof v === 'object') {
          return Object.entries(v).map(([key, val]) => `${key}: ${val}`).join(', ');
        }
        // Asegurar que los caracteres especiales se muestren bien
        return String(v).normalize('NFC');
      });
    });

    try {
      const pdf = new jsPDF('p', 'pt', 'a4');
      pdf.setFontSize(12);
      pdf.text('Datos de Mosquitos', 40, 40);
      autoTable(pdf, {
        head: [headers],
        body: body,
        startY: 60,
        margin: { left: 40, right: 40 },
        styles: { fontSize: 8, cellPadding: 2 },
        bodyStyles: { valign: 'top' },
        didDrawCell: (data) => {
          // Permitir saltos de línea en celdas y mejorar indentación de enfermedades
          if (typeof data.cell.raw === 'string' && data.cell.raw.includes('\n')) {
            data.cell.text = data.cell.raw.split(/\n/g);
          }
        }
      });
      pdf.save(`mosquito_data_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Ocurrió un error al generar el PDF. Revisa la consola para más detalles.');
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={handleDownloadCsv}
        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm"
        aria-label="Descargar datos de mosquitos en CSV"
      >
        Descargar CSV
      </button>
      <button
        type="button"
        onClick={handleDownloadPdf}
        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow-sm"
        aria-label="Descargar datos de mosquitos en PDF"
      >
        Descargar PDF
      </button>
    </div>
  );
}