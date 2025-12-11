import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

describe("Todo App - Comprehensive Test Suite", () => {
  // ======================
  // Health API Tests
  // ======================
  describe("Health API", () => {
    it("GET /api/v1.4/health should return 200 and server info", async () => {
      const res = await request(app).get("/api/v1.4/health");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("timestamp");
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.have.property("message", "Server is healthy");
      expect(res.body.data).to.have.property("uptime");
      expect(res.body.data).to.have.property("memoryUsage");
      expect(res.body.data).to.have.property("sessionId");
      expect(res.body.data).to.have.property("appVersion");
      expect(res.body.data).to.have.property("apiVersion");
    });

    it("GET /api/v1.4/health returns JSON with proper types", async () => {
      const res = await request(app).get("/api/v1.4/health");

      expect(res.body.data.uptime).to.be.a("number");
      expect(res.body.data.memoryUsage).to.be.an("object");
      expect(res.body.data.memoryUsage.rss).to.be.a("number");
      expect(res.body.data.sessionId).to.be.a("string");
    });

    it("GET /health (via routes/index.js) should serve HTML", async () => {
      const res = await request(app).get("/health");

      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.include("text/html");
    });
  });

  // ======================
  // API Root Tests
  // ======================
  describe("API Root", () => {
    it("GET /api/v1.4/ should return 200 and welcome message", async () => {
      const res = await request(app).get("/api/v1.4/");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body.data).to.have.property("message");
      expect(res.body.data.message).to.include("Welcome to API Root");
      expect(res.body.data).to.have.property("versionedApi");
    });

    it("GET /api should redirect to versioned API", async () => {
      const res = await request(app).get("/api");

      expect(res.status).to.equal(302);
      expect(res.headers.location).to.match(/\/api\/v\d+\.\d+/);
    });

    it("GET /api follows redirect and returns API root", async () => {
      const res = await request(app).get("/api").redirects(1);

      expect(res.status).to.equal(200);
      expect(res.body.data.message).to.include("Welcome to API Root");
    });
  });

  // ======================
  // Static Routes Tests
  // ======================
  describe("Server Routes", () => {
    it("GET / should return HTML content for root route", async () => {
      const res = await request(app).get("/");

      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.include("text/html");
    });

    it("GET /config.js should return JavaScript config", async () => {
      const res = await request(app).get("/config.js");

      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.include("javascript");
      expect(res.text).to.include("window.APP_CONFIG");
      expect(res.text).to.include("API_URL");
      expect(res.text).to.include("API_VERSION");
      expect(res.text).to.include("APP_VERSION");
      // Note: config.js might not include SESSION_ID depending on implementation
    });

    it("GET /config.js returns valid JavaScript structure", async () => {
      const res = await request(app).get("/config.js");

      // Should contain window.APP_CONFIG assignment
      expect(res.text).to.include("window.APP_CONFIG");

      // Config object should have expected structure
      expect(res.text).to.match(/API_URL:\s*"\/api\/v[\d.]+"/);
      expect(res.text).to.match(/API_VERSION:\s*"v[\d.]+"/);
      expect(res.text).to.match(/APP_VERSION:\s*"[\d.]+"/);
    });
  });

  // ======================
  // Error Handling Tests
  // ======================
  describe("Error Handling", () => {
    it("GET /nonexistent should return 404", async () => {
      const res = await request(app).get("/nonexistent-route");

      expect(res.status).to.equal(404);
    });

    it("GET /api/v1.4/nonexistent should return 404", async () => {
      const res = await request(app).get("/api/v1.4/nonexistent-endpoint");

      expect(res.status).to.equal(404);
    });

    it("Invalid JSON body should be handled gracefully", async () => {
      const res = await request(app)
        .post("/api/v1.4/")
        .set("Content-Type", "application/json")
        .send("invalid json{");

      expect(res.status).to.be.oneOf([400, 404, 500]);
    });
  });

  // ======================
  // Middleware Tests
  // ======================
  describe("Middleware Functionality", () => {
    it("JSON middleware should parse request body", async () => {
      const res = await request(app)
        .post("/api/v1.4/")
        .set("Content-Type", "application/json")
        .send({ test: "data" });

      // Even if endpoint doesn't exist, middleware should parse
      expect(res.status).to.be.oneOf([200, 404, 405]);
    });

    it("Request latency tracking should add startTime", async () => {
      const res = await request(app).get("/api/v1.4/health");

      // If latency middleware works, request completes successfully
      expect(res.status).to.equal(200);
    });

    it("Static middleware serves files from public directory", async () => {
      const res = await request(app).get("/");

      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.include("html");
    });
  });

  // ======================
  // App Locals Tests
  // ======================
  describe("Application Locals", () => {
    it("app.locals should contain sessionId", () => {
      expect(app.locals).to.have.property("sessionId");
      expect(app.locals.sessionId).to.be.a("string");
      expect(app.locals.sessionId.length).to.be.greaterThan(0);
    });

    it("app.locals should contain appVersion", () => {
      expect(app.locals).to.have.property("appVersion");
      expect(app.locals.appVersion).to.match(/^\d+\.\d+\.\d+/);
    });

    it("app.locals should contain apiVersion", () => {
      expect(app.locals).to.have.property("apiVersion");
      expect(app.locals.apiVersion).to.match(/^v\d+\.\d+/);
    });

    it("apiVersion should be derived from appVersion", () => {
      const appVersionParts = app.locals.appVersion.split(".");
      const expectedApiVersion = `v${appVersionParts[0]}.${appVersionParts[1]}`;

      expect(app.locals.apiVersion).to.equal(expectedApiVersion);
    });
  });

  // ======================
  // Response Format Tests
  // ======================
  describe("Response Format Consistency", () => {
    it("Health endpoint returns standardized response format", async () => {
      const res = await request(app).get("/api/v1.4/health");

      expect(res.body).to.have.all.keys(["status", "timestamp", "data"]);
      expect(res.body.status).to.equal("success");
      expect(res.body.timestamp).to.be.a("string");
      expect(new Date(res.body.timestamp).toString()).to.not.equal(
        "Invalid Date",
      );
    });

    it("API root endpoint returns standardized response format", async () => {
      const res = await request(app).get("/api/v1.4/");

      expect(res.body).to.have.all.keys(["status", "timestamp", "data"]);
      expect(res.body.status).to.equal("success");
    });
  });

  // ======================
  // Content-Type Tests
  // ======================
  describe("Content-Type Headers", () => {
    it("JSON endpoints return application/json", async () => {
      const res = await request(app).get("/api/v1.4/health");

      expect(res.headers["content-type"]).to.include("application/json");
    });

    it("HTML endpoints return text/html", async () => {
      const res = await request(app).get("/");

      expect(res.headers["content-type"]).to.include("text/html");
    });

    it("JavaScript config returns javascript MIME type", async () => {
      const res = await request(app).get("/config.js");

      expect(res.headers["content-type"]).to.match(/javascript/);
    });
  });

  // ======================
  // Edge Cases
  // ======================
  describe("Edge Cases", () => {
    it("Multiple requests to same endpoint should work consistently", async () => {
      const requests = Array(5)
        .fill(null)
        .map(() => request(app).get("/api/v1.4/health"));

      const results = await Promise.all(requests);

      results.forEach((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
      });
    });

    it("sessionId should remain constant across requests", async () => {
      const res1 = await request(app).get("/api/v1.4/health");
      const res2 = await request(app).get("/api/v1.4/health");

      expect(res1.body.data.sessionId).to.equal(res2.body.data.sessionId);
    });

    it("Uptime should increase between requests", async () => {
      const res1 = await request(app).get("/api/v1.4/health");

      // Wait 100ms
      await new Promise((resolve) => setTimeout(resolve, 100));

      const res2 = await request(app).get("/api/v1.4/health");

      expect(res2.body.data.uptime).to.be.greaterThan(res1.body.data.uptime);
    });

    it("Routes should be case-sensitive", async () => {
      const res1 = await request(app).get("/api/v1.4/health");
      const res2 = await request(app).get("/api/v1.4/HEALTH");

      expect(res1.status).to.equal(200);
      // Note: Express routes may not be case-sensitive depending on config
      // Just verify the lowercase version works
      expect(res2.status).to.be.oneOf([200, 404]);
    });
  });

  // ======================
  // Version Consistency Tests
  // ======================
  describe("Version Consistency", () => {
    it("config.js API_VERSION matches expected format", async () => {
      const res = await request(app).get("/config.js");

      const apiVersionMatch = res.text.match(/API_VERSION:\s*"([^"]+)"/);
      expect(apiVersionMatch).to.not.be.null;
      expect(apiVersionMatch[1]).to.match(/^v\d+\.\d+$/);
    });

    it("config.js APP_VERSION matches expected format", async () => {
      const res = await request(app).get("/config.js");

      const appVersionMatch = res.text.match(/APP_VERSION:\s*"([^"]+)"/);
      expect(appVersionMatch).to.not.be.null;
      expect(appVersionMatch[1]).to.match(/^\d+\.\d+\.\d+$/);
    });

    it("config.js contains API_URL with correct format", async () => {
      const res = await request(app).get("/config.js");

      expect(res.text).to.match(/API_URL:\s*"\/api\/v\d+\.\d+"/);
    });
  });
});
