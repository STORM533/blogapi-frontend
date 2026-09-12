import { describe, it, expect, beforeEach } from "vitest";
import { getToken, setToken, clearToken } from "../token";

beforeEach(() => {
  localStorage.clear();
});

describe("token utils", () => {
  it("returns null when no token is set", () => {
    expect(getToken()).toBeNull();
  });

  it("stores and retrieves token", () => {
    setToken("test-token-123");
    expect(getToken()).toBe("test-token-123");
  });

  it("clears token", () => {
    setToken("test-token-123");
    clearToken();
    expect(getToken()).toBeNull();
  });
});
