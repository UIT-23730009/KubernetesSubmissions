import express from "express";
import routes from "./routes/index.js";

const app = express();

// Global middleware
app.use(express.json());

// Register routes
app.use("/", routes);

// Global error handler (optional, good practice)
app.use((err, req, res) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
