import express from "express";
import { Router } from "express";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";

const app = express();
const port = process.env.TODO_PORT || 3000;
const router = Router();

// Load environment variables
dotenv.config({ path: "../../.env" });

const env = process.env.NODE_ENV || "development";

// --- Health Endpoint ---
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns server status, uptime, memory usage, and version info
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     endpoints:
 *                       type: array
 *                       items:
 *                         type: string
 *                     uptime:
 *                       type: number
 *                     memoryUsage:
 *                       type: object
 *                       properties:
 *                         rss:
 *                           type: number
 *                         heapTotal:
 *                           type: number
 *                         heapUsed:
 *                           type: number
 *                     sessionId:
 *                       type: string
 *                     appVersion:
 *                       type: string
 *                     apiVersion:
 *                       type: string
 *             example:
 *               status: "success"
 *               timestamp: "2025-11-02T00:00:00.000Z"
 *               data:
 *                 message: "Server is healthy"
 *                 endpoints: ["/health"]
 *                 uptime: 12345
 *                 memoryUsage:
 *                   rss: 2345678
 *                   heapTotal: 1234567
 *                   heapUsed: 987654
 *                 sessionId: "123e4567-e89b-12d3-a456-426614174000"
 *                 appVersion: "1.0.0"
 *                 apiVersion: "v1.0"
 */
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    console.log("SUCCESS: API v1.4 route was successfully hit!");
    console.log("Request Headers:", req.headers); // Debug headers
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    sendResponse(res, {
      message: "Server is healthy",
      endpoints: ["/health"],
      uptime,
      memoryUsage,
      sessionId: res.app.locals.sessionId,
      appVersion: res.app.locals.appVersion,
      apiVersion: res.app.locals.apiVersion,
    });
  }),
);

// --- API Root Endpoint ---
/**
 * @swagger
 * /:
 *   get:
 *     summary: API root endpoint
 *     description: Returns welcome message and versioned API info
 *     tags:
 *       - Root
 *     responses:
 *       200:
 *         description: API root info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     endpoints:
 *                       type: array
 *                       items:
 *                         type: string
 *                     versionedApi:
 *                       type: string
 *             example:
 *               status: "success"
 *               timestamp: "2025-11-02T00:00:00.000Z"
 *               data:
 *                 message: "Welcome to API Root version v1.0"
 *                 endpoints: ["/"]
 *                 versionedApi: "/api/v1.0/"
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    console.log("SUCCESS: API route was successfully hit!");
    console.log("Request Headers:", req.headers); // Debug headers
    sendResponse(res, {
      message: "Welcome to API Root version " + res.app.locals.apiVersion,
      endpoints: ["/"],
      versionedApi: `/api/${res.app.locals.apiVersion}/`,
    });
  }),
);

export default router;
