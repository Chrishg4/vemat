// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const lecturasRoute = require('./routes/lecturas');
const geoRoute = require('./routes/geo');
const datosLecturaRoute = require('./routes/datosLectura');
const datosGeoRoute = require('./routes/datosGeo');


const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS mejorada para desarrollo y producción
const allowedOrigins = [
  'https://vemat-frontend.onrender.com',  // Frontend en Render
  'https://vemat.onrender.com',           // Backend en Render (para llamadas internas)
  'http://localhost:5173',                // Vite dev server
  'http://127.0.0.1:5173',               // Alternativa localhost
  'http://localhost:4173',               // Vite preview
  'http://127.0.0.1:4173'                // Alternativa localhost preview
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, apps móviles)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('No permitido por CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Manejar preflight requests explícitamente
app.options('*', cors(corsOptions));
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API


app.use('/api/lecturas', lecturasRoute);
app.use('/api/geo', geoRoute);
app.use('/api/datosLectura', datosLecturaRoute);
app.use('/api/datosGeo', datosGeoRoute);


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
      datosLectura: '/api/datosLectura',  // ← AGREGAR ESTA LÍNEA
  datosGeo: '/api/datosGeo',
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
