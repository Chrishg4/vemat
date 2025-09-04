// src/components/iconoBioacustica.jsx
import React from 'react';

// Componente de icono SVG personalizado para Bioacústica.
export default function IconoBioacustica({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={className}
      aria-labelledby="title"
    >
      <title id="title">Icono de Bioacústica</title>
      <circle 
        cx="100" 
        cy="100" 
        r="80" 
        fill="var(--ia-text)" 
      />
      <path 
        d="M80,60 L80,140 L130,100 Z" 
        fill="var(--ia-error)" 
      />
      <path 
        d="M140,70 C150,80 155,90 155,100 C155,110 150,120 140,130" 
        stroke="var(--ia-error)" 
        strokeWidth="8" 
        fill="none" 
      />
      <path 
        d="M155,50 C170,65 180,80 180,100 C180,120 170,135 155,150" 
        stroke="var(--ia-error)" 
        strokeWidth="8" 
        fill="none" 
      />
      <text 
        x="100" 
        y="170" 
        textAnchor="middle" 
        fontSize="20" 
        fontWeight="bold" 
        fill="var(--ia-error)" 
      >
        Hz
      </text>
    </svg>
  );
}