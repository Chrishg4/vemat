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
// Rutas IA
const consultaRoute = require('./routes/consulta');
const statusRoute = require('./routes/status');
const promptsRoute = require('./routes/prompts');
const diagnosticoRoute = require('./routes/diagnostico');


const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS mejorada para desarrollo y producción
const allowedOrigins = [
  'https://vemat-frontend.onrender.com',  // Frontend en Render
  'https://vemat.onrender.com',           // Backend en Render (para llamadas internas)
  'http://localhost:5173',                // Vite dev server
  'http://127.0.0.1:5173',               // Alternativa localhost
  'http://localhost:4173',               // Vite preview
  'http://127.0.0.1:4173',               // Alternativa localhost preview
  'http://localhost:3000',               // Backend local para pruebas
  'http://127.0.0.1:3000'                // Alternativa localhost backend
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, apps móviles) 
    if (!origin) return callback(null, true);
    
    // En desarrollo, ser más permisivo
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      return callback(null, true);
    }
    
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
// Rutas IA
app.use('/api/consulta', consultaRoute);
app.use('/api/status', statusRoute);
app.use('/api/prompts', promptsRoute);
app.use('/api/diagnostico', diagnosticoRoute);


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
      datosGeo: '/api/datosGeo',
      // Endpoints IA
      consulta: '/api/consulta',
      status: '/api/status',
      prompts: '/api/prompts',
      diagnostico: '/api/diagnostico',
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
