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

const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url)),
);
const packageVersion = pkg.version;

// Read VERSION file from project root
const rootVersionPath = path.resolve(__dirname, "../../VERSION");
const rawVersion = fs.existsSync(rootVersionPath)
  ? fs.readFileSync(rootVersionPath, "utf8").trim()
  : packageVersion;

const appVersion = process.env.APP_VERSION ?? rawVersion;
const apiVersion = `v${appVersion.split(".").slice(0, 2).join(".")}`;

console.log(
  `Starting Todo App Server - App Version: ${appVersion}, API Version: ${apiVersion}`,
);

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

// latency
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// --------------------------
// Routes
// --------------------------
app.use("/", routes);
app.use("/api", routes); // generic API routes
app.use(`/api/${apiVersion}`, apiRoutes); // versioned API


// --------------------------
// "/api" redirect → versioned
// --------------------------
app.get("/api", (req, res) => {
  const target = `/api/${apiVersion}`;
  res.redirect(target);

  res.on("finish", () => {
    console.log({
      event: "Redirect /api → versioned",
      to: target,
      status: res.statusCode,
      latency: `${Date.now() - req.startTime}ms`,
      timestamp: new Date().toISOString(),
    });
  });
});

// --------------------------
// "/api/health" redirect → "/api/vX/health"
// --------------------------
app.get("/api/health", (req, res) => {
  const target = `/api/${apiVersion}/health`;
  res.redirect(target);

  res.on("finish", () => {
    console.log({
      event: "Redirect /api/health → versioned",
      to: target,
      status: res.statusCode,
      latency: `${Date.now() - req.startTime}ms`,
      timestamp: new Date().toISOString(),
    });
  });
});

// --------------------------
// Versioned health-check
// Example: /api/v1/health
// --------------------------
app.get(`/api/${apiVersion}/health`, (req, res) => {
  const health = {
    status: "ok",
    versioned: true,
    appVersion,
    apiVersion,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    sessionId: app.locals.sessionId,
  };

  res.status(200).json(health);

  res.on("finish", () => {
    console.log({
      event: "Versioned health-check",
      url: req.originalUrl,
      status: res.statusCode,
      latency: `${Date.now() - req.startTime}ms`,
      timestamp: new Date().toISOString(),
    });
  });
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
