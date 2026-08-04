import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRM Pro - Customer Relationship Management API",
      version: "1.0.0",
      description: "Live Software Requirements Specification (SRS) compliant Backend API Documentation covering all 20 modules."
    },
    tags: [
      {
        name: "01. Authentication",
        description: "Login, OTP, refresh token, logout, and session lifecycle"
      },
      {
        name: "02. Role & Permission",
        description: "Role definitions, permissions, and access control management"
      },
      {
        name: "03. User Management",
        description: "Employee and user lifecycle management"
      }
    ],
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token directly without 'Bearer ' prefix (e.g. eyJhbGci...)"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
