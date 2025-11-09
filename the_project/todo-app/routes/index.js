import { Router } from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../../.env" });

// Config
const port = process.env.TODO_PORT || 3000;
const router = Router();

// // Health check route
// router.get("/health", (req, res) => {
//   res.status(200).json({ status: "UP", message: "Server is healthy" });
// });

// // Root route
// router.get("/", (req, res) => {
//   res.send(` Server running on port ${port}`);
// });

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Server is healthy'
  });
});


export default router;
