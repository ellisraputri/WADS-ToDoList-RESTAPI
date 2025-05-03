import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ToDo List API',
      version: '1.0.0',
      description: 'API documentation for the ToDo List application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid' // This should match your session cookie name
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export {swaggerSpec, swaggerUi}
