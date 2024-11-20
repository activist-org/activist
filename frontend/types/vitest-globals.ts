/* eslint-disable no-var */
import type { Mock } from 'vitest';
import type { defineStore as DefineStore } from 'pinia';

type Modes = 'light' | 'dark';
export type UseColorModeFn = () => {
  preference: Modes;
  value: Modes;
}

declare global {
  var useColorModeMock: Mock<UseColorModeFn>;
  var defineStore: typeof DefineStore;
}
