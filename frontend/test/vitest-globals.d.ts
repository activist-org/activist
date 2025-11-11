// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Mock } from "vitest";

type colorMode = "light" | "dark";
export type UseColorModeFn = () => {
  preference: colorMode;
  value: colorMode;
};

// Note: Can't define anything here that conflicts with Nuxt's auto-imports.
declare global {
  // interface GlobalThis {
  //   useColorModeMock: Mock<UseColorModeFn>;
  // }
  const useColorModeMock: Mock<UseColorModeFn>;
}
