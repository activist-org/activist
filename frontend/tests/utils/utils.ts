import type { Page } from "@playwright/test";

export async function isMobile(page: Page): Promise<boolean> {
  const viewportSize = page.viewportSize();
  return viewportSize !== null && viewportSize.width < 768;
}
