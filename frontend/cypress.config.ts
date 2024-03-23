import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        someTask() {
          console.log("Executing a custom task.");
        },
      });

      console.log("Cypress config:", config);
    },
  },
});
