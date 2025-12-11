import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import app from "./app.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

// --------------------------
// Init
// --------------------------
const server = express();

// --------------------------
// Load environment variables
// --------------------------
dotenv.config({ path: "../../.env" });

// --------------------------
// Config
// --------------------------
const PORT = process.env.TODO_PORT ?? 3000;
const ENV = process.env.NODE_ENV ?? "development";

// Extract app-level info
const { sessionId, appVersion, apiVersion } = app.locals;

// --------------------------
// Security & Middleware
// --------------------------
server.use(helmet()); // Secure headers

// Cross-Origin Resource Sharing
server.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);
server.use(morgan("tiny")); // Log HTTP requests
server.use(express.json()); // Parse JSON bodies
server.set("trust proxy", 1);
// --------------------------
// Rate Limiting
// --------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
server.use(limiter);

// --------------------------
// Logging Middleware
// --------------------------
server.use(morgan("tiny"));
server.use(requestLogger);

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "TODO APP API",
      version: `${apiVersion}`,
      description: "Todo app API service",
    },
    servers: [
      {
        url: `/api/v1.4`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --------------------------
// Mount Main App
// --------------------------
server.use(app);

// --------------------------
// 404 & Error Handlers
// --------------------------
server.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
server.use(errorHandler);

// --------------------------
// Start Server
// --------------------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${ENV}]`);
  console.log(`Session ID: ${sessionId}`);
  console.log(`App Version: ${appVersion}, API Version: ${apiVersion}`);
  console.log(`Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
});
