// src/components/Header.jsx
import React from "react";
import { MdBugReport } from "react-icons/md"; // Ícono de bug/insecto
import { GiAmberMosquito } from "react-icons/gi";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <span className="text-sm font-semibold text-gray-300 whitespace-nowrap mr-4">
          Universidad Tecnica Nacional - Sede Guanacaste
        </span>
        
        <h1 className="text-xl font-bold flex-1 text-center mx-auto flex items-center justify-center">
          
          <GiAmberMosquito className="mr-2 text-yellow-400 text-2xl" />
          Sistema de monitoreo ecoepidemiológico de los mosquitos
        </h1>
        
        <div className="w-48">{/* Espacio para mantener el título centrado */}</div>
      </div>
    </header>
  );
}
