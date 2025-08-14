// src/components/Login.jsx
import React from "react";
import FormularioInicioSesion from "./formularioInicioSesion";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black flex items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4 text-white text-xl font-bold">VEMAT/UTN</div>
  <FormularioInicioSesion />
    </div>
  );
}