// https://nuxt.com/docs/getting-started/testing
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    env: {
      VITE_FRONTEND_URL: "http://localhost:3000",
      VITE_API_URL: "http://localhost:8000/v1",
    },
    environment: "nuxt",
    exclude: [
      "**/node_modules/**",
      "./tests", // exclude e2e tests
    ],
    globals: true,
    setupFiles: ["./test/setup.ts"],
  },
});
