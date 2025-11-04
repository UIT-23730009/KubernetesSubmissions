import express from "express";
import routes from "./routes/index.js";
import { v7 as uuidv7 } from "uuid";

const app = express();
// Generate random string once on startup
const sessionId = uuidv7();
// share globally inside Express
app.locals.sessionId = sessionId;
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
