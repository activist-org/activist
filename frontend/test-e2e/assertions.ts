import type { Page } from "playwright";
import { expect } from "playwright/test";

export async function expectTheme(page: Page, theme: string): Promise<void> {
  await expect(page.locator("html")).toHaveClass(theme);
}
