// src/components/Co2Icon.jsx
import React from 'react';

// Este es un componente de icono SVG personalizado.
// El color del texto se establece en blanco para que contraste con el fondo de color.
export default function Co2Icon({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 120" 
      className={className}
      aria-labelledby="title"
    >
      <title id="title">Icono de Nube de CO2</title>
      <path 
        d="M155.7,63.4c-2.1-16.3-16.6-29-34.1-29c-4.8,0-9.4,1-13.6,2.9c-7.5-11.5-20-19.2-34.4-19.2c-21.5,0-39,17.5-39,39 c0,2.5,0.2,5,0.7,7.4C16.1,66.8,0,84.7,0,105.5C0,124.5,15.5,140,34.5,140h121c22.1,0,40-17.9,40-40 C195.5,82.5,178.1,65.6,155.7,63.4z" 
        fill="#FFF" // La nube será blanca, el círculo de fondo le dará el color.
      />
      <text 
        x="50%" 
        y="55%" 
        dy=".3em" 
        textAnchor="middle" 
        fontSize="40" 
        fontWeight="bold" 
        fill="#0088FE" // El texto tendrá el color azul característico
      >
        CO₂
      </text>
    </svg>
  );
}
