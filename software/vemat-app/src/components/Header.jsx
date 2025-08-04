import React from 'react';

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-semibold">Monitorización Vemat</span>
      </div>
      <div className="flex items-center space-x-2">
        {/* Aquí puedes poner tu logo o un icono */}
        <span className="text-blue-400 text-3xl">🌐</span> {/* Ejemplo de icono */}
        <h1 className="text-2xl font-bold">VEMAT - Vigilancia Ecológica de Mosquitos</h1>
      </div>
      <p className="text-sm text-gray-400">Sistema de monitoreo de zonas vulnerables</p>
    </header>
  );
}

export default Header;