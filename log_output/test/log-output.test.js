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

  it("should return server status and session ID in correct format", (done) => {
    request(app)
      .get("/") // Giả sử route '/' trả về thông báo này
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        console.log("Response text:", JSON.stringify(res.text));

        assert.match(
          res.text.trim(),
          /^Server running on port \d+\. Session ID: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          "The response text must match the expected server status and session ID format",
        );

        done();
      });
  });
});
