import {
  MIME_TO_EXT,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  DEFAULT_PROMPT,
} from "../common";

describe("common types and constants", () => {
  it("should have correct MIME to extension mapping", () => {
    expect(MIME_TO_EXT["image/jpeg"]).toBe("jpeg");
    expect(MIME_TO_EXT["image/jpg"]).toBe("jpeg");
    expect(MIME_TO_EXT["image/png"]).toBe("png");
    expect(MIME_TO_EXT["image/webp"]).toBe("webp");
  });

  it("should derive allowed MIME types from MIME_TO_EXT", () => {
    expect(ALLOWED_MIME_TYPES).toEqual(Object.keys(MIME_TO_EXT));
    expect(ALLOWED_MIME_TYPES).toContain("image/jpeg");
    expect(ALLOWED_MIME_TYPES).toContain("image/png");
    expect(ALLOWED_MIME_TYPES).toContain("image/webp");
  });

  it("should have correct file size limits", () => {
    expect(MAX_FILE_SIZE_MB).toBe(10);
    expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024);
  });

  it("should have a Jurassic Park themed default prompt", () => {
    expect(DEFAULT_PROMPT).toContain("dinosaurs");
    expect(DEFAULT_PROMPT).toContain("Jurassic Park");
    expect(DEFAULT_PROMPT.length).toBeGreaterThan(20);
  });
});
