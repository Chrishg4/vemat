// src/components/Header.jsx
import React from 'react';
import { FaGlobeAmericas } from 'react-icons/fa'; // Icono para el globo

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        {/* Logo VEMAT o cualquier imagen que quieras usar */}
        {/* Puedes reemplazar el icono por una imagen: <img src="/path/to/your/logo.png" alt="VEMAT Logo" className="h-8 mr-3" /> */}
        <h1 className="text-2xl font-bold mr-4">Monitorización Vemat</h1>
        <div className="flex items-center text-lg">
          <FaGlobeAmericas className="mr-2 text-blue-400" />
          <span className="font-semibold">VEMAT - Vigilancia Ecológica de Mosquitos</span>
        </div>
      </div>
      <span className="text-gray-400 text-sm hidden md:block">Sistema de monitoreo de zonas vulnerables</span>
    </header>
  );
}