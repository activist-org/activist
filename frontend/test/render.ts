import { renderSuspended } from "@nuxt/test-utils/runtime";
import { getActivePinia } from 'pinia';

const render: typeof renderSuspended = (component, options = {}) => {

  // Pinia set up
  options.global = options.global ?? {};
  const plugins = options.global.plugins;
  options.global.plugins = plugins ? [getActivePinia()!, ...plugins] : [getActivePinia()!];

  return renderSuspended(component, options);
}

export default render;
