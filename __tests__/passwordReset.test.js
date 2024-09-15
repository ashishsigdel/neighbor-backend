/* @desc this file contains all the test cases for reset-password endpoints
 * @requires supertest
 * @requires app
 * @property {function} describe - Test suite
 * @property {function} it - Test spec
 * @property {function} expect - Assertion
 * @property {function} request - HTTP request
 * @property {function} app - Express application
 * @returns {void}
 */

import request from "supertest";
import { app } from "../app.js";

let resetToken = "";

//test endpoints for reset-password
describe("Reset Password endpoints - Forgot Password", () => {
  it("should give 422 if body is not valid", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/forgot-password")
      .send({});

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");
  });

  it("should show email not found", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/forgot-password")
      .send({
        email: "kaadhikari@softup.io",
      });

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");

    expect(res.body.errors[0]).toHaveProperty("email");
  });

  it("should send OTP to email", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/forgot-password")
      .send({
        email: "kadhikari@softup.io",
      });

    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("message");

    resetToken = res.body.data.resetToken;

    expect(resetToken).toBeDefined();
  });
});

describe("Reset Password endpoints - Verify OTP", () => {
  it("should give 422 if body is not valid", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/verify-otp")
      .send({});

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");
  });

  it("should show reset token not found", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/verify-otp")
      .send({
        resetToken: "fffdsdfsdf",
        otp: "123456",
      });

    expect(res.statusCode).toEqual(404);

    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toEqual("Invalid reset token");
  });
});

describe("Reset Password endpoints - Reset Password", () => {
  it("should give 422 if body is not valid", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/reset-password")
      .send({});

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");
  });

  it("should show reset token not found", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/reset-password")
      .send({
        resetToken: "fffdsdfsdf",
        otp: "123456",
        password: "Arjun@123@#",
        confirmPassword: "Arjun@123@#",
      });

    expect(res.statusCode).toEqual(404);

    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toEqual("Invalid reset token");
  });

  it("should throw weak password error", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/reset-password")
      .send({
        resetToken: resetToken,
        otp: "123456",
        password: "123456",
        confirmPassword: "123456",
      });

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");

    expect(res.body.errors[0]).toHaveProperty("password");
  });

  it("should throw password mismatch error", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/reset-password")
      .send({
        resetToken: resetToken,
        otp: "123456",
        password: "Arjun@123@#",
        confirmPassword: "Arjun@123@", // mismatch
      });

    expect(res.statusCode).toEqual(422);

    expect(res.body).toHaveProperty("errors");

    expect(res.body.errors[0]).toHaveProperty("confirmPassword");
  });

  it("should fail otp invalid", async () => {
    const res = await request(app)
      .post("/api/v1/password-reset/reset-password")
      .send({
        resetToken: resetToken,
        otp: "123456",
        password: "Arjun@123@#",
        confirmPassword: "Arjun@123@#",
      });

    expect(res.statusCode).toEqual(400);

    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toEqual("Invalid OTP");
  });
});
