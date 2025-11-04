import request from "supertest";
import { assert } from "chai";
import app from "../app.js";

describe("Server Routes", () => {
  // Test 1: GET /health
  it("should return 200 and UP status for the /health route", async () => {
    const res = await request(app).get("/health");
    assert.equal(res.status, 200, "HTTP status should be 200");
    assert.equal(res.body.status, "UP", "Server is healthy");
  });

  // Test 2: GET / (root route)
  it("should return welcome message for the root route", async () => {
    const res = await request(app).get("/");
    assert.equal(res.status, 200);
    assert.match(
      res.text,
      /Server running on port \d+/,
      "Response should contain server info",
    );
  });
});
