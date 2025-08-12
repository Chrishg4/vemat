// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const lecturasRoute = require('./routes/lecturas');
const geoRoute = require('./routes/geo');
const datosLecturaRoute = require('./routes/datosLectura');
const latlogRoute = require('./routes/lat&loglecturas');


const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS para producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-frontend-url.com', 'https://vemat-api.onrender.com', 'http://vemat-api.onrender.com'] 
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API

app.use('/api/lecturas', lecturasRoute);
app.use('/api/geo', geoRoute);
app.use('/api/datosLectura', datosLecturaRoute);
app.use('/api/latlog', latlogRoute);


// Ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'API VEMAT funcionando 🚀',
    version: '1.0.0',
    swagger: '/api-docs',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      lecturas: '/api/lecturas',
      geo: '/api/geo',
      datosLectura: '/api/datosLectura',  // ← AGREGAR ESTA LÍNEA
  latlog: '/api/latlog',
  swagger: '/api-docs'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 Servidor activo en puerto ${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
});
