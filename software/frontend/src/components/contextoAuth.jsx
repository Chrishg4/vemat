// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [tema, setTema] = useState('light'); // 'light' o 'dark'

  useEffect(() => {
    const root = document.documentElement;
    if (tema === 'light') {
      root.classList.remove('theme-azure-dark');
      root.classList.add('theme-azure');
    } else {
      root.classList.remove('theme-azure');
      root.classList.add('theme-azure-dark');
    }
  }, [tema]);

  const toggleTema = () => setTema((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
