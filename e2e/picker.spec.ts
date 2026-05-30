import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test("opens, filters, and selects with the mouse", async ({ page }) => {
  const trigger = page.getByTestId("trigger").first();
  await trigger.click();

  const content = page.getByTestId("content").first();
  await expect(content).toBeVisible();

  await page.getByTestId("search").first().fill("Roboto");
  const option = page.getByText("Roboto Mono", { exact: true });
  await expect(option).toBeVisible();
  await option.click();

  await expect(trigger).toContainText("Roboto Mono");
  await expect(page.getByTestId("content")).toHaveCount(0);
});

test("navigates and selects with the keyboard", async ({ page }) => {
  const trigger = page.getByTestId("trigger").first();
  await trigger.click();

  const search = page.getByTestId("search").first();
  await search.press("ArrowDown");
  await search.press("Enter");

  // Selection closes the popup.
  await expect(page.getByTestId("content")).toHaveCount(0);
});

test("dismisses on Escape", async ({ page }) => {
  const trigger = page.getByTestId("trigger").first();
  await trigger.click();
  await expect(page.getByTestId("content").first()).toBeVisible();

  await page.getByTestId("search").first().press("Escape");
  await expect(page.getByTestId("content")).toHaveCount(0);
});
