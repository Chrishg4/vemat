// src/components/iconoHumedad.jsx
import React from 'react';

// Componente de icono SVG personalizado para Humedad.
export default function IconoHumedad({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={className}
      aria-labelledby="title"
    >
      <title id="title">Icono de Humedad</title>
      <path 
        d="M100,20 C100,20 40,100 40,140 C40,173.137 67.4903,200 100,200 C132.51,200 160,173.137 160,140 C160,100 100,20 100,20 Z" 
        fill="var(--ia-text)" 
      />
      <path 
        d="M100,40 C100,40 55,105 55,140 C55,164.853 75.1472,185 100,185 C124.853,185 145,164.853 145,140 C145,105 100,40 100,40 Z" 
        fill="var(--ia-success)" 
      />
      <path 
        d="M100,80 C100,80 75,120 75,140 C75,151.046 86.1929,160 100,160 C113.807,160 125,151.046 125,140 C125,120 100,80 100,80 Z" 
        fill="var(--ia-text)" 
      />
      <text 
        x="100" 
        y="140" 
        textAnchor="middle" 
        fontSize="30" 
        fontWeight="bold" 
        fill="var(--ia-success)" 
      >
        %
      </text>
    </svg>
  );
}