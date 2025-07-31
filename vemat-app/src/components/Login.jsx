import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const usuariosPrueba = [
  { usuario: "admin@vemat.com", contrasena: "admin123" },
  { usuario: "operador@vemat.com", contrasena: "operador123" },
  { usuario: "demo", contrasena: "demo123" },
];

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loginExitoso, setLoginExitoso] = useState(false);
  const navigate = useNavigate();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoginExitoso(false);

    const usuarioValido = usuariosPrueba.find(
      (u) => u.usuario === usuario && u.contrasena === contrasena
    );

    if (usuarioValido) {
      setLoginExitoso(true);
      login(usuarioValido.usuario); // Usar la función login del contexto
      setTimeout(() => {
        navigate("/lecturas-actuales");
      }, 1500);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4"> {/* Fondo oscuro */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-700"> {/* Contenedor oscuro */}
        <div className="flex flex-col items-center mb-6">
          <img src="/vemat-logo.png" alt="VEMAT Logo" className="h-16 mb-2" /> {/* Asegúrate de tener tu logo en la carpeta public */}
          <h2 className="text-xl font-semibold text-gray-100 mb-1">Vigilancia Ecológica</h2> {/* Texto blanco */}
          <p className="text-gray-400 text-sm">Accede al sistema de monitoreo</p> {/* Texto gris claro */}
        </div>

        {/* Mensaje de éxito solo si loginExitoso es true */}
        {loginExitoso && (
          <div className="bg-green-700 border border-green-600 text-white px-4 py-3 rounded relative mb-4 text-center" role="alert">
            <strong className="font-bold">¡Login exitoso!</strong>
            <span className="block sm:inline">Cargando sistema...</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="usuario" className="block text-gray-300 text-sm font-bold mb-2">Usuario o Email</label> {/* Texto label gris claro */}
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="contrasena" className="block text-gray-300 text-sm font-bold mb-2">Contraseña</label> {/* Texto label gris claro */}
            <div className="relative">
              <input
                type={mostrarContrasena ? "text" : "password"}
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={toggleMostrarContrasena}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {mostrarContrasena ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 13.75 15.75m-.21 2.276h.008v.008a2.35 2.35 0 0 0 2.35 2.35h2.1a.375.375 0 0 0 .375-.375V9.828c0-1.036-.84-1.872-1.875-1.872H19.5a.375.375 0 0 0 .375.375v.45m-4.21 8.4a2.35 2.35 0 0 1-2.35-2.35h-.008v-.008a2.35 2.35 0 0 1-2.35-2.35V11c0-1.036-.84-1.872-1.875-1.872H4.875a.375.375 0 0 1-.375-.375V8.375m11.215 8.4a2.35 2.35 0 0 0 2.35-2.35h.008v-.008a2.35 2.35 0 0 0 2.35-2.35V11c0-1.036-.84-1.872-1.875-1.872H13.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.037 12.232 13.97 2.193a1.005 1.005 0 0 1 1.421 1.06l-10.89 7.188-3.181 2.104A1.037 1.037 0 0 1 2.037 12.232Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-400 text-sm"> {/* Texto gris claro */}
              <input type="checkbox" className="form-checkbox mr-2 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" /> {/* Checkbox oscuro con acento azul */}
              Recordarme
            </label>
            <a href="#" className="inline-block align-baseline font-semibold text-sm text-blue-400 hover:text-blue-300"> {/* Enlace azul claro */}
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200" // Corregido: removido comentario interno
          >
            Iniciar Sesión
          </button>
        </form>
        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>} {/* Mensaje de error rojo */}

        <div className="mt-6 text-center text-gray-400"> {/* Texto gris claro */}
          Sistema de monitoreo ambiental VEMAT
          <p className="font-bold mt-2">Credenciales de prueba:</p>
          <ul className="list-disc pl-5 text-left inline-block"> {/* Lista alineada a la izquierda y centrada con el contenedor */}
            <li>admin@vemat.com / admin123</li>
            <li>operador@vemat.com / operador123</li>
            <li>demo / demo123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}