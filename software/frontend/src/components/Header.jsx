// src/components/Header.jsx
import React from "react";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <span className="text-sm font-semibold text-gray-300 whitespace-nowrap mr-4">
          Universidad Tecnica Nacional - Sede Guanacaste
        </span>
        
        <h1 className="text-xl font-bold flex-1 text-center mx-auto">
          <span role="img" aria-label="world symbol" className="mr-2">🌎</span>
           Sistema de monitoreo de mosquitos
        </h1>
        
        <div className="w-48"> {/* Espacio equivalente al lado izquierdo para mantener el título centrado */}
        </div>
      </div>
    </header>
  );
}