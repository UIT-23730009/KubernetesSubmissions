import request from "supertest";
import { assert } from "chai";
import app from "../app.js";

describe("Server Routes", () => {
  // Test 1: GET /health
  it("should return HTML server health", async () => {
    const res = await request(app).get("/health");
    assert.equal(res.status, 200);
    assert.include(res.headers["content-type"], "text/html");
  });

  // Test 2: GET / (root route)
  it("should return HTML content for root route", async () => {
    const res = await request(app).get("/");
    assert.equal(res.status, 200);
    assert.include(res.headers["content-type"], "text/html");
  });

  // Test 3: GET /config.js
  it("should return JavaScript config", async () => {
    const res = await request(app).get("/config.js");
    assert.equal(res.status, 200);
    assert.include(res.headers["content-type"], "javascript");
  });

  // Test 4: GET /nonexistent (should return 404)
  it("should return 404 for nonexistent route", async () => {
    const res = await request(app).get("/nonexistent");
    assert.equal(res.status, 404);
  });

  // Test 5: GET /api (should redirect to versioned API)
  it("should redirect /api to versioned API", async () => {
    const res = await request(app).get("/api");
    assert.equal(res.status, 302);
    assert.match(res.headers["location"], /^\/api\/v\d+\.\d+/);
  });
});
