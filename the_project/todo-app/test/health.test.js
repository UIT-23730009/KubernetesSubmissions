import * as chai from 'chai';
import chaiHttp from "chai-http";
import supertest from "supertest";
import app from "../app.js";


const { expect } = chai;
chai.use(chaiHttp);
const apiVersion = app.locals.apiVersion;
const request = supertest(app);
describe("Health API", function () {
  it(`GET /api/${apiVersion}/health should return status 200 and server info`, async function () {
    const res = await request.get(`/api/${apiVersion}/health`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("timestamp");
    expect(res.body).to.have.property("data");

    const data = res.body.data;
    expect(data).to.have.property("message", "Server is healthy");
    expect(data).to.have.property("uptime").that.is.a("number");
    expect(data).to.have.property("memoryUsage").that.is.an("object");
    expect(data).to.have.property("sessionId").that.is.a("string");
    expect(data).to.have.property("appVersion").that.is.a("string");
    expect(data).to.have.property("apiVersion").that.is.a("string");
  });

  it(`GET /api/${apiVersion}/health returns JSON with proper types`, async function () {
    const res = await request.get(`/api/${apiVersion}/health`);
    const memoryUsage = res.body.data.memoryUsage;

    expect(memoryUsage).to.include.keys("rss", "heapTotal", "heapUsed");
    expect(memoryUsage.rss).to.be.a("number");
    expect(memoryUsage.heapTotal).to.be.a("number");
    expect(memoryUsage.heapUsed).to.be.a("number");
  });
});

describe("API Root", function () {
  it(`GET /api/${apiVersion}/ should return status 200 and welcome message`, async function () {
    const res = await request.get(`/api/${apiVersion}/`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("timestamp");
    expect(res.body).to.have.property("data");

    const data = res.body.data;
    expect(data).to.have.property(
      "message",
      "Welcome to API Root version " + apiVersion
    );
    expect(data).to.have.property("endpoints").that.is.an("array").that.includes("/");
    expect(data).to.have.property("versionedApi").that.is.a("string");
  });
});

describe("Server Routes", function () {
  it("should redirect / to versioned API", async function () {
    const res = await request.get("/").redirects(0); // prevent auto-follow
    expect(res.status).to.equal(302);
    expect(res.headers.location).to.equal(`/api/${apiVersion}`);
  });
});
