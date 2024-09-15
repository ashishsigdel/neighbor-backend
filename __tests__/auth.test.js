/**
 * @desc this file contains all the test cases for auth endpoints
 * @requires supertest
 * @requires app
 * @property {function} describe - Test suite
 * @property {function} it - Test spec
 * @property {function} expect - Assertion
 * @property {function} request - HTTP request
 * @property {function} app - Express application
 * @property {string} accessToken - Access token
 * @returns {void}
 */

import request from "supertest";
import { app } from "../app.js";

let accessToken = "";

//test endpoints for auth
describe("Auth endpoints - Register", () => {
  it("should give 422 if body is not valid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({});

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");
  });

  it("should show email already exist", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      fullName: "Krishna Adhikari",
      email: "kadhikari@softup.io",
      password: "12345678",
      confirmPassword: "12345678",
    });

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");

    expect(res.body.errors[0]).toHaveProperty("email");
  });

  it("should throw weak password error", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      fullName: "Arjun Acharya",
      email: "aacharya@softup.io",
      password: "123456",
      confirmPassword: "123456",
    });

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");

    expect(res.body.errors[0]).toHaveProperty("password");
  });

  it("should throw password mismatch error", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      fullName: "Arjun Acharya",
      email: "aacharya@softup.io",
      password: "Arjun@123@#",
      confirmPassword: "Arjun@123@", // mismatch
    });

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");

    expect(res.body.errors[0]).toHaveProperty("confirmPassword");
  });

  it("should register user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      fullName: "Arjun Acharya",
      email: "aacharya@softup.io",
      password: "Arjun@123@#",
      confirmPassword: "Arjun@123@#",
    });

    expect(res.statusCode).toEqual(201);

    expect(res.body).toHaveProperty("message");
  });
});

describe("Auth endpoints - Login", () => {
  it("should throw 422 if body is not valid", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({});

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");
  });

  it("should throw 401 if user is not registered", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@test.com",
      password: "12345678",
      deviceType: "web",
      device: "Macbook Pro",
    });

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toEqual("Invalid credentials");
  });

  it("should throw 401 if password is incorrect", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "kadhikari@softup.io",
      password: "12345678",
      deviceType: "web",
      device: "Macbook Pro",
    });

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toEqual("Invalid credentials");
  });

  it("should login user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("User-Agent", "Test Agent")
      .send({
        email: "kadhikari@softup.io",
        password: "Krishna123@#",
        deviceType: "web",
        device: "Macbook Pro",
      });

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toHaveProperty("accessToken");

    accessToken = res.body.data.accessToken;
  });
});

describe("Auth endpoints - Refresh Access Token", () => {
  it("should throw 422 if body is not valid", async () => {
    const res = await request(app).post("/api/v1/auth/refresh-token").send({});

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");
  });

  it("should throw 401 if refresh token is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/refresh-token").send({
      refreshToken: "invalid-refresh-token",
      deviceType: "web",
      device: "Macbook Pro",
    });

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toEqual("Unauthorized");
  });

  it("should refresh access token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("User-Agent", "Test Agent")
      .send({
        deviceType: "web",
        device: "Macbook Pro",
      });

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toHaveProperty("accessToken");
  });
});

describe("Auth endpoints - Logout", () => {
  it("should throw unauthorized error if user is not logged in", async () => {
    const res = await request(app).post("/api/v1/auth/logout");

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message");
  });

  it("should logout user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("message");
  });
});

describe("Auth endpoints - Logout All", () => {
  it("should throw unauthorized error if user is not logged in", async () => {
    const res = await request(app).post("/api/v1/auth/logout-all");

    expect(res.statusCode).toEqual(401);

    expect(res.body).toHaveProperty("message");
  });

  it("should logout user from all devices", async () => {
    const res = await request(app)
      .post("/api/v1/auth/logout-all")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("message");
  });
});
