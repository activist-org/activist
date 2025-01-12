// SPDX-License-Identifier: AGPL-3.0-or-later
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { getActivePinia } from "pinia";

const render: typeof renderSuspended = (component, options = {}) => {
  // Set up Pinia.
  options.global = options.global ?? {};
  const plugins = options.global.plugins;
  options.global.plugins = plugins
    ? [getActivePinia()!, ...plugins]
    : [getActivePinia()!];

  return renderSuspended(component, options);
};

export default render;
