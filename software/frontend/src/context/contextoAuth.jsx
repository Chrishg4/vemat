// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

// Crear el contexto
const ContextoAuth = createContext(null);

// Proveedor de contexto
export function ProveedorContextoAuth({ children }) {
  const [user, setUser] = useState(null); // Inicialmente no hay usuario

  const login = (username) => setUser(username);  // Ahora guardamos el nombre de usuario
  const logout = () => setUser(null);     // Limpia la sesión del usuario

  return (
    <ContextoAuth.Provider value={{ user, login, logout }}>
      {children}
    </ContextoAuth.Provider>
  );
}

// Hook para consumir el contexto
export function useContextoAuth() {
  return useContext(ContextoAuth);
}