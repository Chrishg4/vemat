// backend/swagger/swagger.js

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API VEMAT',
    version: '1.0.0',
    description: 'Recepción de lecturas ambientales desde dispositivos IoT',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
    {
      url: 'https://vemat-api.onrender.com', // Cambiá esto si usás otro hosting
      description: 'Servidor público',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
