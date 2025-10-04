/**
 * @jest-environment node
 */

/* eslint-disable @typescript-eslint/no-require-imports */

describe("env validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Clear the cache between tests
    jest.isolateModules(() => {
      require("../env");
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should parse valid environment variables", () => {
    process.env.HF_API_KEY = "test-key";
    process.env.HF_SECRET = "test-secret";

    const { getEnv } = require("../env");
    const env = getEnv();

    expect(env.HF_API_KEY).toBe("test-key");
    expect(env.HF_SECRET).toBe("test-secret");
  });

  it("should throw error when HF_API_KEY is missing", () => {
    delete process.env.HF_API_KEY;
    process.env.HF_SECRET = "test-secret";

    const { getEnv } = require("../env");
    expect(() => {
      getEnv();
    }).toThrow("Missing or invalid environment variables");
  });

  it("should throw error when HF_SECRET is missing", () => {
    process.env.HF_API_KEY = "test-key";
    delete process.env.HF_SECRET;

    const { getEnv } = require("../env");
    expect(() => {
      getEnv();
    }).toThrow("Missing or invalid environment variables");
  });

  it("should work with proxy for backwards compatibility", () => {
    process.env.HF_API_KEY = "proxy-test-key";
    process.env.HF_SECRET = "proxy-test-secret";

    const { env } = require("../env");

    expect(env.HF_API_KEY).toBe("proxy-test-key");
    expect(env.HF_SECRET).toBe("proxy-test-secret");
  });
});
