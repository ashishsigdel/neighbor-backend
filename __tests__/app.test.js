import request from "supertest";
import { app } from "../app.js";

describe("Test 404 for whole app if route not found", () => {
  test("It should respond with 404 for invalid route", async () => {
    const response = await request(app).get("/notfound");
    expect(response.statusCode).toBe(404);
  });
});
