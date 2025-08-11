// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const lecturasRoute = require('./routes/lecturas');
const geoRoute = require('./routes/geo');
const datosLecturaRoute = require('./routes/datosLectura');
// const nodosRoute = require('./routes/nodos');        // TODO: Crear archivo
// const alertasRoute = require('./routes/alertas');    // TODO: Crear archivo


const app = express();
const PORT = process.env.PORT || 3000;

// Orígenes permitidos (prod + dev)
const allowedOrigins = [
  'https://vemat-frontend.onrender.com', // frontend en Render
  'https://vemat.onrender.com',          // por si hay llamadas cruzadas internas
  'http://localhost:5173',               // Vite dev
  'http://127.0.0.1:5173',
  'http://localhost:4173',               // preview build de Vite
  'http://127.0.0.1:4173'
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);               // Postman/cURL
    return cb(null, allowedOrigins.includes(origin)); // true/false
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};

app.use(cors(corsOptions));
// Manejo explícito del preflight
app.options('*', cors(corsOptions));
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API
app.use('/api/lecturas', lecturasRoute);
app.use('/api/geo', geoRoute);
app.use('/api/datosLectura', datosLecturaRoute);
// app.use('/api/nodos', nodosRoute);         // TODO: Crear archivo nodos.js
// app.use('/api/alertas', alertasRoute);     // TODO: Crear archivo alertas.js


// Ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'API VEMAT funcionando ',
    version: '1.0.0',
    swagger: '/api-docs',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      lecturas: '/api/lecturas',
      geo: '/api/geo',
      datosLectura: '/api/datosLectura',
      // nodos: '/api/nodos',           // TODO: Implementar
      // alertas: '/api/alertas',       // TODO: Implementar
      swagger: '/api-docs'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(` Servidor activo en puerto ${PORT}`);
  console.log(` Documentación Swagger: http://localhost:${PORT}/api-docs`);
});
