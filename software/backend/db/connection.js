// backend/db/connection.js

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { 
    rejectUnauthorized: false  // Permitir certificados auto-firmados de Aiven
  },
  connectTimeout: 60000,  // 60 segundos
  acquireTimeout: 60000,
  timeout: 60000
});

// Test de conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error(' Error conectando a la base de datos:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error(' Conexión perdida, reintentando...');
    }
  } else {
    console.log(' Conectado exitosamente a la base de datos Aiven');
    connection.release();
  }
});

module.exports = pool;
