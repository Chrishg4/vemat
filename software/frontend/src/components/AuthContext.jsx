import React, { createContext, useContext, useState } from "react";

// Crear el contexto
const AuthContext = createContext(null);

// Proveedor de contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Inicialmente no hay usuario

  const login = (username) => setUser(username);  // Ahora guardamos el nombre de usuario
  const logout = () => setUser(null);     // Limpia la sesión del usuario

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir el contexto
export function useAuth() {
  return useContext(AuthContext);
}
