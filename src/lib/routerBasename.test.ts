import { describe, expect, it } from "vitest";
import { getRouterBasename } from "./routerBasename";

describe("getRouterBasename", () => {
  it("uses Vite absolute BASE_URL when provided", () => {
    expect(getRouterBasename("/repo/", "https://example.com/whatever/")).toBe("/repo");
    expect(getRouterBasename("/", "https://example.com/repo/")).toBe("");
  });

  it("infers basename from document URL when BASE_URL is relative", () => {
    expect(getRouterBasename("./", "https://example.com/repo/")).toBe("/repo");
    expect(getRouterBasename("./", "https://example.com/repo/index.html")).toBe("/repo");
    expect(getRouterBasename("./", "https://example.com/")).toBe("");
  });

  it("returns empty string when it cannot infer a base", () => {
    expect(getRouterBasename("./")).toBe("");
  });
});
