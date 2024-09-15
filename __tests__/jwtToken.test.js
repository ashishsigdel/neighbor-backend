import {
  generateToken,
  verifyToken,
  removeBearer,
} from "../app/utils/jwtUtil.js";

describe("JWT Token", () => {
  test("Generate JWT Token", () => {
    const token = generateToken({
      payload: { id: 1, role: "admin" },
      expiresIn: 5,
    });

    expect(token).toBeTruthy();
  });

  it("Verify JWT Token", () => {
    const token = generateToken({
      payload: { id: 1, role: "admin" },
      expiresIn: 5,
    });

    const payload = verifyToken({ token });

    expect(payload).toBeTruthy();
    expect(payload.id).toBe(1);
    expect(payload.role).toBe("admin");
  });

  it("Invalid JWT Token", () => {
    const token = generateToken({
      payload: { id: 1, role: "admin" },
      expiresIn: 5,
    });

    const modifiedToken = token.slice(0, token.length - 1);

    expect(() => {
      verifyToken({ token: modifiedToken });
    }).toThrow();
  });

  it("JWT Token without Bearer", () => {
    const token = generateToken({
      payload: { id: 1, role: "admin" },
      expiresIn: 5,
    });

    //add Bearer to token
    const tokenWithBearer = `Bearer ${token}`;

    const tokenWithoutBearer = removeBearer(tokenWithBearer);

    expect(tokenWithoutBearer).toBe(token);
  });
});
