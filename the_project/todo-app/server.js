// --------------------------
// Imports
// --------------------------
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

// --------------------------
// Config
// --------------------------
const PORT = process.env.TODO_PORT ?? 3000;
const ENV = process.env.NODE_ENV ?? "development";

const { sessionId, appVersion, apiVersion } = {
  sessionId: app.locals.sessionId ?? "unknown",
  appVersion: app.locals.appVersion ?? "0.0.0",
  apiVersion: app.locals.apiVersion ?? "v1",
};


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost",
  "http://todo-page.colasloth.com",
  "https://todo-page.colasloth.com",
  "http://todo-app.colasloth.com",
  "https://todo-app.colasloth.com",
];


// --------------------------
// Core & Security Middleware
// --------------------------
server.set("trust proxy", 1);
server.use(express.json({ limit: "10kb" }));

// Helmet
server.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
        "img-src": [
          "'self'",
          "data:",
          "https:",
          "https://validator.swagger.io",
        ],
        "connect-src": ["'self'", ...allowedOrigins],
        "font-src": ["'self'", "https://cdnjs.cloudflare.com"],
      },
    },
  })
);

// CORS
server.use(
  cors({
    origin(origin, cb) {
      // Allow no-origin (curl, internal Docker)
      if (!origin) return cb(null, true);

      // Allow configured origins
      if (allowedOrigins.includes(origin)) {
        console.log(`CORS allowed: ${origin}`);
        return cb(null, true);
      }

      // Dev mode: allow any localhost
      if (ENV === "development" && origin.startsWith("http://localhost:")) {
        return cb(null, true);
      }

      console.warn(`CORS blocked: ${origin}`);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    maxAge: 86400, // Cache preflight 24h
  })
);


// Rate Limiter
server.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15m
    max: 100,
    message: { error: "Too many requests, please try again later" },
  })
);

// --------------------------
// Logging Middleware
// --------------------------
server.use(morgan("tiny"));
server.use(requestLogger);

// --------------------------
// Swagger Docs
// --------------------------
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "TODO APP API",
      version: `${apiVersion}`,
      description: "Todo app API service",
    },
    servers: [{ url: `${BASE_URL}/api/${apiVersion}` }],
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
