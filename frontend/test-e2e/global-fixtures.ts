// SPDX-License-Identifier: AGPL-3.0-or-later
import { test as base, expect as baseExpect } from "@playwright/test";

/**
 * Custom test fixtures for Activist E2E tests.
 *
 * Currently uses Playwright's default fixtures without modifications.
 * Authentication state is managed via storageState in playwright.config.ts.
 *
 * This file serves as a centralized place to extend Playwright's test fixtures
 * with custom behavior if needed in the future.
 */
export const test = base;

export { baseExpect as expect };
