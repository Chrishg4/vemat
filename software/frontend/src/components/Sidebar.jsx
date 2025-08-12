// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChartLine, FaMapMarkedAlt, FaTable, FaUserCircle, FaSignOutAlt, FaBell, FaBars, FaChevronLeft, FaCalendarWeek, FaRobot } from 'react-icons/fa';

export default function Sidebar({ username, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center p-2 rounded-lg transition-colors duration-200 text-sm ${
      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'
    }`;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`bg-gray-800 ${
        isCollapsed ? 'w-16' : 'w-56'
      } p-3 flex flex-col shadow-lg transition-all duration-300 relative`}>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors duration-200"
      >
        {isCollapsed ? <FaBars size={14} /> : <FaChevronLeft size={14} />}
      </button>

      <div className={`mb-6 mt-2 text-center ${isCollapsed ? 'px-0' : 'px-2'}`}>
        {username && (
          <div className="flex items-center justify-center text-white text-base font-semibold mb-3">
            <FaUserCircle className={`text-blue-400 text-2xl ${isCollapsed ? '' : 'mr-2'}`} />
            {!isCollapsed && username}
          </div>
        )}
        {!isCollapsed && <h2 className="text-xl font-bold text-white">Menú</h2>}
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
            <NavLink to="/grafica" className={linkClasses} title="Gráfica de Datos">
              <FaChartLine className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Gráfica de Datos'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/epi-week-chart" className={linkClasses} title="Gráfica Semana Epidemiológica">
              <FaChartLine className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Gráfica Semana Epidemiológica'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/resumen-semanal" className={linkClasses} title="Resumen Semanal">
              <FaCalendarWeek className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Resumen Semanal'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/mapa" className={linkClasses} title="Mapa de Ubicación">
              <FaMapMarkedAlt className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Mapa de Ubicación'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/historial" className={linkClasses} title="Historial de Lecturas">
              <FaTable className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Historial de Lecturas'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/alertas" className={linkClasses} title="Historial de Alertas">
              <FaBell className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Historial de Alertas'}
            </NavLink>
          </li>
          <li>
            <NavLink to="/ia-assistant" className={linkClasses} title="Asistente IA">
              <FaRobot className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isCollapsed && 'Asistente IA'}
            </NavLink>
          </li>
          
        </ul>
      </nav>
      <button
        onClick={onLogout}
        className="mt-4 flex items-center justify-center p-2 w-full text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
        title="Cerrar Sesión"
      >
        <FaSignOutAlt className={`text-lg ${isCollapsed ? 'mx-auto' : 'mr-2'}`} />
        {!isCollapsed && 'Cerrar Sesión'}
      </button>
    </aside>
  );
}