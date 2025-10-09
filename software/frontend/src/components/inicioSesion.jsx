// src/components/Login.jsx
import React from "react";
import FormularioInicioSesion from "./formularioInicioSesion";

export default function Login() {
  return (
  <div className="min-h-screen bg-ia-background text-ia-text flex items-center justify-center p-4 relative transition-colors duration-500">
  <div className="absolute top-4 left-4 text-ia-text text-xl font-bold transition-colors duration-500">VEMAT/UTN</div>
  <FormularioInicioSesion />
    </div>
  );
}