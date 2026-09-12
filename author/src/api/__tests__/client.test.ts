import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch, FetchError } from "../client";

describe("apiFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("makes a GET request with correct headers and credentials", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await apiFetch("/test-endpoint");

    expect(mockFetch).toHaveBeenCalledWith("/api/test-endpoint", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    expect(result).toEqual({ data: "test" });
  });

  it("throws FetchError on non-ok response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: "Not found" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(apiFetch("/not-found")).rejects.toThrow(FetchError);
  });

  it("returns undefined for 204 response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await apiFetch("/no-content");
    expect(result).toBeUndefined();
  });
});
