// SPDX-License-Identifier: AGPL-3.0-or-later

import { renderSuspended } from "@nuxt/test-utils/runtime";
import { config } from "@vue/test-utils";
import { getActivePinia } from "pinia";

const render: typeof renderSuspended = (component, options = {}) => {
  // Merge config.global from @vue/test-utils (plugins, mocks, components, etc.)
  // into the options passed to renderSuspended. Without this, renderSuspended
  // doesn't pick up the i18n plugin (and other globals) registered in vitest setup.
  options.global = {
    ...config.global,
    ...options.global,
    plugins: [
      ...(config.global.plugins ?? []),
      getActivePinia()!,
      ...(options.global?.plugins ?? []),
    ],
    mocks: {
      ...(config.global.mocks ?? {}),
      ...(options.global?.mocks ?? {}),
    },
    components: {
      ...(config.global.components ?? {}),
      ...(options.global?.components ?? {}),
    },
  };

  return renderSuspended(component, options);
};

export default render;
