import {
  comparePassword,
  hashPassword,
  validatePassword,
} from "../app/services/passwordService.js";

describe("Password Service", () => {
  it("should hash password", async () => {
    const password = "password";
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toEqual(password);
  });

  it("should compare password", async () => {
    const password = "password";
    const hashedPassword = await hashPassword(password);
    const isMatch = await comparePassword(password, hashedPassword);
    expect(isMatch).toEqual(true);
  });

  it("should not validate easy password", () => {
    const password = "password";
    const isValid = validatePassword(password);
    expect(isValid).toEqual(false);
  });

  it("should validate password", () => {
    const password = "Password123";
    const isValid = validatePassword(password);
    expect(isValid).toEqual(true);
  });
});
