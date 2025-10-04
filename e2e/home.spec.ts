import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load and display the main title", async ({ page }) => {
    await page.goto("/");

    // Check for the main title
    await expect(
      page.getByRole("heading", { name: /jurassic park video generator/i })
    ).toBeVisible();

    // Check for the file upload input
    await expect(page.getByLabel(/upload image/i)).toBeVisible();

    // Check that the generate button is initially disabled
    const generateButton = page.getByRole("button", { name: /generate jurassic park video/i });
    await expect(generateButton).toBeDisabled();
  });

  test("should enable generate button when file is selected", async ({ page }) => {
    await page.goto("/");

    // Create a mock file
    const buffer = Buffer.from("fake-image-data");
    await page.setInputFiles('input[type="file"]', {
      name: "test-image.jpg",
      mimeType: "image/jpeg",
      buffer,
    });

    // Button should now be enabled
    const generateButton = page.getByRole("button", { name: /generate jurassic park video/i });
    await expect(generateButton).toBeEnabled();
  });

  test("should display error when generating without credentials", async ({ page }) => {
    await page.goto("/");

    // Mock the file upload
    const buffer = Buffer.from("fake-image-data");
    await page.setInputFiles('input[type="file"]', {
      name: "test-image.jpg",
      mimeType: "image/jpeg",
      buffer,
    });

    // Intercept API call and return error
    await page.route("/api/generate", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Authentication failed" }),
      });
    });

    // Click generate
    const generateButton = page.getByRole("button", { name: /generate jurassic park video/i });
    await generateButton.click();

    // Should show error message
    await expect(page.getByText(/authentication failed/i)).toBeVisible();
  });
});
