// src/components/barraLateral.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChartLine, FaMapMarkedAlt, FaTable, FaUserCircle, FaSignOutAlt, FaBell, FaBars, FaChevronLeft, FaCalendarWeek, FaRobot, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function BarraLateral({ username, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const linkClasses = ({ isActive }) =>
    `flex items-center p-2 rounded-lg transition-colors duration-500 text-sm ${
      isActive 
        ? 'bg-ia-accent text-ia-text shadow-md' 
        : 'text-ia-text-secondary hover:bg-ia-card'
    }`;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`bg-ia-card border-r border-ia-border ${
        isCollapsed ? 'w-16' : 'w-56 md:w-64'
      } p-3 flex flex-col shadow-lg transition-colors duration-500 fixed md:sticky top-0 h-screen z-40`}>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-ia-accent text-ia-text p-1 rounded-full hover:opacity-90 transition-colors duration-500"
      >
        {isCollapsed ? <FaBars size={14} /> : <FaChevronLeft size={14} />}
      </button>

      <div className={`mb-6 mt-2 text-center ${isCollapsed ? 'px-0' : 'px-2'}`}>
        {username && (
          <div className="flex items-center justify-center text-ia-text text-base font-semibold mb-3">
            <FaUserCircle className={`text-ia-info text-2xl ${isCollapsed ? '' : 'mr-2'}`} />
            {!isCollapsed && username}
          </div>
        )}
        {!isCollapsed && <h2 className="text-xl font-bold text-ia-text">Menú</h2>}
      </div>

      <nav className="flex-1">
        <ul className="space-y-1.5">
          <li>
            <NavLink to="/dashboard" className={linkClasses} title="Panel Principal">
              <FaTachometerAlt className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Panel Principal'}
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/lecturas-actuales" className={linkClasses} title="Lecturas Actuales">
              <FaTachometerAlt className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Lecturas Actuales'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/analisis" className={linkClasses} title="Análisis Combinado">
              <FaChartLine className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Análisis Combinado'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/graficos-detallados" className={linkClasses} title="Gráficos Detallados">
              <FaChartLine className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Gráficos Detallados'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/resumen-semanal" className={linkClasses} title="Resumen Semanal">
              <FaCalendarWeek className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Resumen Semanal'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/mapas" className={linkClasses} title="Mapas">
              <FaMapMarkedAlt className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Mapas'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/alertas" className={linkClasses} title="Historial de Alertas">
              <FaBell className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Historial de Alertas'}
            </NavLink>
          </li>
        </ul>
      </nav>
      <button
        onClick={onLogout}
        className="mt-4 flex items-center justify-center p-2 w-full text-sm text-ia-text-secondary hover:bg-ia-card-hover rounded-lg transition-colors duration-200"
        title="Cerrar Sesión"
      >
        <FaSignOutAlt className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
        {!isCollapsed && 'Cerrar Sesión'}
      </button>
    </aside>
  );
}