// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it } from "vitest";

/**
 * NOTE: The full sign-in flow (including @sidebase/nuxt-auth) is currently
 * tested via Playwright E2E specs under frontend/test-e2e/specs/all/authentication.
 * These Vitest tests are intentionally left as TODOs until we decide on a
 * maintainable unit-testing strategy for the auth pages.
 */
describe("sign-in", () => {
  it.todo("signs in user with valid credentials");
  it.todo("shows an error message when credentials are invalid");
});
