// src/components/iconoTemperatura.jsx
import React from 'react';

// Componente de icono SVG personalizado para Temperatura.
export default function IconoTemperatura({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={className}
      aria-labelledby="title"
    >
      <title id="title">Icono de Temperatura</title>
      <circle 
        cx="100" 
        cy="100" 
        r="80" 
        fill="var(--ia-text)" 
      />
      <rect 
        x="90" 
        y="40" 
        width="20" 
        height="90" 
        rx="10" 
        fill="var(--ia-warning)" 
      />
      <circle 
        cx="100" 
        cy="150" 
        r="25" 
        fill="var(--ia-warning)" 
      />
      <circle 
        cx="100" 
        cy="150" 
        r="15" 
        fill="var(--ia-text)" 
      />
      <text 
        x="130" 
        y="70" 
        fontSize="30" 
        fontWeight="bold" 
        fill="var(--ia-warning)" 
      >
        °
      </text>
    </svg>
  );
}