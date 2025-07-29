// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const lecturasRoute = require('./routes/lecturas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API
app.use('/lecturas', lecturasRoute);

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor VEMAT funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor activo en http://localhost:${PORT}`);
});
