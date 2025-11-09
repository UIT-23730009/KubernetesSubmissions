import { v7 as uuidv7 } from "uuid";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "../../.env" });
const port = process.env.LOG_OUTPUT_PORT ?? 3000;

const sessionId = app.locals.sessionId;

console.log(`Application started. Session ID: ${sessionId}`);

// Print every 5 seconds with timestamp
setInterval(() => {
  var generated_id = uuidv7();
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${generated_id}`);
}, 5000);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Session ID: ${sessionId}`);
});

// Graceful shutdown (useful in Kubernetes)
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});
