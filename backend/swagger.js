const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rabbitt AI Sales Automator API',
      version: '1.0.0',
      description: 'API for analyzing CSV/Excel files using AI and emailing summaries',
    },
    servers: [{ url: 'http://localhost:8000' }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
