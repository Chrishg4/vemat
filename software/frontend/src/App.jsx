import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TableroPrincipal from "./components/tableroPrincipal";
import { ProveedorContextoAuth } from "./context/contextoAuth";
import { ProveedorContextoTablero } from "./context/contextoTablero";
import { ThemeProvider } from "./context/themeContext";
import InicioSesion from "./components/inicioSesion";
import { useContextoAuth } from "./context/contextoAuth";
import AsistenteIA from "./components/asistenteIA";
import ComponenteDeAlertas from "./components/ComponenteDeAlertas";

// Componente de protección de rutas
function RutaProtegida({ children }) {
  const { user } = useContextoAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-ia-background text-ia-text transition-colors duration-500">
        <BrowserRouter>
          <ProveedorContextoAuth>
            <ProveedorContextoTablero>
              <Routes>
                <Route path="/login" element={<InicioSesion />} />
                <Route path="/*" element={
                  <RutaProtegida>
                    <>
                      <TableroPrincipal />
                      <AsistenteIA />
                      <ComponenteDeAlertas />
                    </>
                  </RutaProtegida>
                } />
              </Routes>
            </ProveedorContextoTablero>
          </ProveedorContextoAuth>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}