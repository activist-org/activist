// https://nuxt.com/docs/getting-started/testing
import { defineVitestConfig } from "@nuxt/test-utils/config";

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
  },
});
