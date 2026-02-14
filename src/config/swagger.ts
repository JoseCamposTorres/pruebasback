import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Love Send - API Documentation",
      version: "1.0.0",
      description: "Documentación oficial de Love Send",
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? "https://lovesendback.wolfcodetech.com"
          : "http://localhost:3000",
        description: "Servidor API"
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: { type: "apiKey", in: "header", name: "x-api-key" },
        BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: [
    path.join(process.cwd(), "src/routes/*.ts"),
    path.join(process.cwd(), "dist/routes/*.js"),
    path.join(process.cwd(), "routes/*.js")
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
