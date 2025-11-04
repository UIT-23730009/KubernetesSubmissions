import { Router } from "express";

const router = Router();

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Server is healthy",
  });
});

// Root route
router.get("/", (req, res) => {
  const port = process.env.LOG_OUTPUT_PORT || 3000;
  const sessionId = req.app.locals.sessionId;

  res
    .status(200)
    .send(`Server running on port ${port}. Session ID: ${sessionId}`);
});

export default router;
