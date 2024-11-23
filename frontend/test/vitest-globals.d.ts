/* eslint-disable no-var */
import type { Mock } from "vitest";

type colorMode = "light" | "dark";
export type UseColorModeFn = () => {
  preference: colorMode;
  value: colorMode;
};

// Note: Can't define anything here that conflicts with Nuxt's auto-imports.
declare global {
  var useColorModeMock: Mock<UseColorModeFn>;
}
