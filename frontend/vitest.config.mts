// SPDX-License-Identifier: AGPL-3.0-or-later
// See: https://nuxt.com/docs/getting-started/testing
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineVitestConfig({
  test: {
    env: {
      VITE_FRONTEND_URL: "http://localhost:3000",
      VITE_API_URL: "http://localhost:8000/v1",
      VITEST: "true",
    },
    environment: "nuxt",
    // Only search test directories to speed up test setup.
    include: [
      "./test/**/*.{test,spec}.?(c|m)[jt]s",
      "./tests/**/*.{test,spec}.?(c|m)[jt]s",
    ],
    globals: true,
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: resolve(__dirname, "coverage"),
      thresholds: {
        statements: 20,
        branches: 20,
        functions: 20,
        lines: 20,
      },
    },
  },
});
