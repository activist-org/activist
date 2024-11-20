/* eslint-disable no-var */
import type { Mock } from "vitest";

type Modes = "light" | "dark";
export type UseColorModeFn = () => {
  preference: Modes;
  value: Modes;
};

// Note: Can't define anything here that conflicts with Nuxt's auto-imports
declare global {
  var useColorModeMock: Mock<UseColorModeFn>;
}
