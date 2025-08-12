// src/services/authService.js

// Usuarios de prueba para autenticación
const usuariosPrueba = [
  { usuario: "admin@vemat.com", contrasena: "admin123" },
  { usuario: "operador@vemat.com", contrasena: "operador123" },
  { usuario: "demo", contrasena: "demo123" },
];

/**
 * Verifica las credenciales del usuario
 * @param {string} username - Nombre de usuario o email
 * @param {string} password - Contraseña
 * @returns {Object|null} - Usuario si las credenciales son válidas, null si no
 */
export const validateCredentials = (username, password) => {
  const usuarioValido = usuariosPrueba.find(
    (u) => u.usuario === username && u.contrasena === password
  );
  
  return usuarioValido ? { username: usuarioValido.usuario } : null;
};

/**
 * Simula el proceso de login
 * @param {string} username - Nombre de usuario o email
 * @param {string} password - Contraseña
 * @returns {Promise} - Promesa con el resultado del login
 */
export const login = async (username, password) => {
  // Simulamos una petición asíncrona
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = validateCredentials(username, password);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Usuario o contraseña incorrectos'));
      }
    }, 500); // Simulamos un delay de 500ms
  });
};