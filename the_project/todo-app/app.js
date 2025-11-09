import express from "express";
import routes from "./routes/index.js";
import apiRoutes from "./routes/api.js";
import { fileURLToPath } from "url";
import path from "path";
import { v7 as uuidv7 } from "uuid";
import fs from "fs";

// --------------------------
// Package info & versioning
// --------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));
const packageVersion = pkg.version;

// Read VERSION file from project root
const rootVersionPath = path.resolve(__dirname, "../../VERSION");
const rawVersion = fs.existsSync(rootVersionPath)
  ? fs.readFileSync(rootVersionPath, "utf8").trim()
  : packageVersion;

const appVersion = process.env.APP_VERSION ?? rawVersion;
const apiVersion = `v${appVersion.split(".").slice(0, 2).join(".")}`;

console.log(`Starting Todo App Server - App Version: ${appVersion}, API Version: ${apiVersion}`);

// --------------------------
// Create Express app
// --------------------------
const app = express();

// Global middleware
app.use(express.json());

// --------------------------
// Generate session ID & share app info
// --------------------------
const sessionId = uuidv7();
app.locals.sessionId = sessionId;
app.locals.appVersion = appVersion;
app.locals.apiVersion = apiVersion;

// --------------------------
// Routes
// --------------------------
app.use("/", routes);
app.use("/api", routes);                   // generic API routes
app.use(`/api/${apiVersion}`, apiRoutes); // versioned API

// Root redirect to versioned API
app.get("/", (req, res) => {
  res.redirect(`/api/${apiVersion}`);
  console.log(`Redirected / to /api/${apiVersion}`);
  //log  event
  console.log(`Event: Root accessed, redirected to versioned API`);
  console.log(`Source IP: ${req.ip}, User-Agent: ${req.get("User-Agent")}`);
  console.log(`destination: /api/${apiVersion}`);
  console.log(`status: ${res.statusCode}`);
  console.log(`timestamp: ${new Date().toISOString()}`);
  console.log(`latency: ${Date.now() - req.startTime}ms`);
  console.log(`memoryUsage: ${JSON.stringify(process.memoryUsage())}`);
  console.log(`uptime: ${process.uptime()} seconds`);
});

// --------------------------
// Global error handler
// --------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
  //log  event
  console.log(`Source IP: ${req.ip}, User-Agent: ${req.get("User-Agent")}`);
  console.log(`destination: /api/${apiVersion}`);
  console.log(`status: ${res.statusCode}`);
  console.log(`timestamp: ${new Date().toISOString()}`);
  console.log(`latency: ${Date.now() - req.startTime}ms`);
  console.log(`memoryUsage: ${JSON.stringify(process.memoryUsage())}`);
  console.log(`uptime: ${process.uptime()} seconds`);
});


export default app;
