// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChartLine, FaMapMarkedAlt, FaTable, FaUserCircle, FaSignOutAlt, FaBell } from 'react-icons/fa';

export default function Sidebar({ username, onLogout }) {
  const linkClasses = ({ isActive }) =>
    `flex items-center p-2 rounded-lg transition-colors duration-200 text-sm ${
      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'
    }`;

  return (
    <aside className="bg-gray-800 w-56 p-3 flex flex-col shadow-lg">
      <div className="mb-6 mt-2 text-center">
        {username && (
          <div className="flex items-center justify-center text-white text-base font-semibold mb-3">
            <FaUserCircle className="mr-2 text-blue-400 text-2xl" />
            {username}
          </div>
        )}
        <h2 className="text-xl font-bold text-white">Menú</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1.5">
          <li>
            <NavLink to="/dashboard" className={linkClasses}>
              <FaTachometerAlt className="mr-2 text-lg" />
              Panel Principal
            </NavLink>
          </li>
          <li>
            <NavLink to="/lecturas-actuales" className={linkClasses}>
              <FaTachometerAlt className="mr-2 text-lg" />
              Lecturas Actuales
            </NavLink>
          </li>
          <li>
            <NavLink to="/grafica" className={linkClasses}>
              <FaChartLine className="mr-2 text-lg" />
              Gráfica Temp/Humedad
            </NavLink>
          </li>
          <li>
            <NavLink to="/mapa" className={linkClasses}>
              <FaMapMarkedAlt className="mr-2 text-lg" />
              Mapa de Ubicación
            </NavLink>
          </li>
          <li>
            <NavLink to="/historial" className={linkClasses}>
              <FaTable className="mr-2 text-lg" />
              Historial de Lecturas
            </NavLink>
          </li>
          <li>
            <NavLink to="/alertas" className={linkClasses}>
              <FaBell className="mr-2 text-lg" />
              Historial de Alertas
            </NavLink>
          </li>
        </ul>
      </nav>
      <button
        onClick={onLogout}
        className="mt-4 flex items-center justify-center p-2 w-full text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
      >
        <FaSignOutAlt className="mr-2 text-lg" />
        Cerrar Sesión
      </button>
    </aside>
  );
}