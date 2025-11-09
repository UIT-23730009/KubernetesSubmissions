import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import app from "./app.js";

// --------------------------
// Load environment variables
// --------------------------
dotenv.config({ path: "../../.env" });

// --------------------------
// Config
// --------------------------
const PORT = process.env.TODO_PORT ?? 3000 ;
const ENV = process.env.NODE_ENV ?? "development";

// Extract app-level info
const { sessionId, appVersion, apiVersion } = app.locals;

// --------------------------
// Security & Middleware
// --------------------------
app.use(helmet());          // Secure headers

// Cross-Origin Resource Sharing
app.use(cors({
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(morgan("tiny"));    // Log HTTP requests
app.use(express.json());    // Parse JSON bodies
app.set('trust proxy', 1); 
// --------------------------
// Rate Limiting
// --------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
        title: "TODO APP API",
        version: `${apiVersion}`,
        description: "Todo app API service"
        },
        servers: [
            {
                url: `https://opulent-space-winner-97794xgp775vcxrg4-3000.app.github.dev/api/v1.4`,
            },
        ],
    components: {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT', 
        },
    },
},
    },
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --------------------------
// Start server
// --------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${ENV}]`);
  console.log(`Session ID: ${sessionId}`);
  console.log(`App Version: ${appVersion}, API Version: ${apiVersion}`);
  console.log(`Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
});
