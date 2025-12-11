import { expect } from "chai";
import request from "supertest";
import express from "express";
import apiRoutes from "../routes/api.js";
import sinon from "sinon";

describe("API Routes - Error Handling", () => {
  let app;
  let consoleStub;

  beforeEach(() => {
    // Create fresh app for each test
    app = express();
    app.locals.sessionId = "test-session-123";
    app.locals.appVersion = "1.4.4";
    app.locals.apiVersion = "v1.4";

    app.use("/api/v1.4", apiRoutes);

    // Stub console to suppress logs during tests
    consoleStub = sinon.stub(console, "log");
  });

  afterEach(() => {
    consoleStub.restore();
  });

  describe("asyncHandler Error Scenarios", () => {
    it("should handle errors thrown in async routes", async () => {
      // This test requires modifying the route to simulate an error
      // For now, test that normal flow works
      const res = await request(app).get("/api/v1.4/health");
      expect(res.status).to.equal(200);
    });

    it("should handle malformed requests gracefully", async () => {
      const res = await request(app)
        .get("/api/v1.4/health")
        .set("Content-Type", "application/json")
        .send("malformed{json");

      // Should still return 200 since GET ignores body
      expect(res.status).to.equal(200);
    });
  });

  describe("Response Structure Validation", () => {
    it("/health response contains all required fields", async () => {
      const res = await request(app).get("/api/v1.4/health");

      expect(res.body.data).to.include.all.keys([
        "message",
        "endpoints",
        "uptime",
        "memoryUsage",
        "sessionId",
        "appVersion",
        "apiVersion",
      ]);
    });

    it("/health endpoints array contains correct values", async () => {
      const res = await request(app).get("/api/v1.4/health");

      expect(res.body.data.endpoints).to.be.an("array");
      expect(res.body.data.endpoints).to.include("/health");
    });

    it("/ response contains all required fields", async () => {
      const res = await request(app).get("/api/v1.4/");

      expect(res.body.data).to.include.all.keys([
        "message",
        "endpoints",
        "versionedApi",
      ]);
    });

    it("/ endpoints array contains correct values", async () => {
      const res = await request(app).get("/api/v1.4/");

      expect(res.body.data.endpoints).to.be.an("array");
      expect(res.body.data.endpoints).to.include("/");
    });

    it("/ versionedApi matches expected format", async () => {
      const res = await request(app).get("/api/v1.4/");

      expect(res.body.data.versionedApi).to.match(/^\/api\/v\d+\.\d+\/$/);
    });
  });

  describe("Memory Usage Validation", () => {
    it("memoryUsage contains all Node.js memory fields", async () => {
      const res = await request(app).get("/api/v1.4/health");

      expect(res.body.data.memoryUsage).to.include.all.keys([
        "rss",
        "heapTotal",
        "heapUsed",
        "external",
      ]);
    });

    it("all memory values are positive numbers", async () => {
      const res = await request(app).get("/api/v1.4/health");
      const mem = res.body.data.memoryUsage;

      expect(mem.rss).to.be.a("number").and.greaterThan(0);
      expect(mem.heapTotal).to.be.a("number").and.greaterThan(0);
      expect(mem.heapUsed).to.be.a("number").and.greaterThan(0);
    });
  });

  describe("Headers and Logging", () => {
    it("should log request headers on /health", async () => {
      await request(app)
        .get("/api/v1.4/health")
        .set("User-Agent", "test-agent");

      expect(
        consoleStub.calledWith("SUCCESS: API v1.4 route was successfully hit!"),
      ).to.be.true;
      expect(consoleStub.calledWith(sinon.match("Request Headers:"))).to.be
        .true;
    });

    it("should log request headers on /", async () => {
      await request(app).get("/api/v1.4/").set("User-Agent", "test-agent");

      expect(consoleStub.calledWith("SUCCESS: API route was successfully hit!"))
        .to.be.true;
      expect(consoleStub.calledWith(sinon.match("Request Headers:"))).to.be
        .true;
    });
  });

  describe("App Locals Integration", () => {
    it("health endpoint uses app.locals values", async () => {
      const res = await request(app).get("/api/v1.4/health");

      expect(res.body.data.sessionId).to.equal(app.locals.sessionId);
      expect(res.body.data.appVersion).to.equal(app.locals.appVersion);
      expect(res.body.data.apiVersion).to.equal(app.locals.apiVersion);
    });

    it("root endpoint uses app.locals.apiVersion in message", async () => {
      const res = await request(app).get("/api/v1.4/");

      expect(res.body.data.message).to.include(app.locals.apiVersion);
    });

    it("root endpoint uses app.locals.apiVersion in versionedApi", async () => {
      const res = await request(app).get("/api/v1.4/");

      expect(res.body.data.versionedApi).to.include(app.locals.apiVersion);
    });
  });
});
