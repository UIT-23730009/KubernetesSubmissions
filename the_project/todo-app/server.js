import dotenv from "dotenv";
import { v7 as uuidv7 } from "uuid";
import app from "./app.js";

// Load environment variables
dotenv.config({ path: "../../.env" });

// Config
const port = process.env.TODO_PORT ?? 3000;
const env = process.env.NODE_ENV ?? "development";
const sessionId = uuidv7();

// Start server
app.listen(port, () => {
  console.log(` Server running on port ${port} [${env}]`);
  console.log(` Session ID: ${sessionId}`);
});
