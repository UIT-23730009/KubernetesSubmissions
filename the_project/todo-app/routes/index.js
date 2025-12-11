import { Router } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: path.resolve("../../.env") });

// Create __dirname manually (ESM fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const port = process.env.TODO_PORT || 3000;
const router = Router();

// Serve homepage
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Serve health page
router.get("/health", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/health.html"));
});

// api Root redirect to versioned API
router.get("/api", (req, res) => {
  res.status(302);
  const apiVersion = req.app.locals.apiVersion || "v1.0";
  res.redirect(`/api/${apiVersion}`);
  console.log(`Redirected /api to /api/${apiVersion}`);
});
export default router;
