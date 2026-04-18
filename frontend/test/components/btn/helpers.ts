// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Component } from "vue";

import render from "../../../test/render";

/**
 * Helper to render a button component with default stubs and props.
 * @param component - The button component to render.
 * @param props - The props to pass to the component.
 * @param additionalStubs - Any additional stubs to include in the global configuration.
 * @returns The result of rendering the component with the specified props and stubs.
 */
export async function renderButton(
  component: Component,
  props: Record<string, unknown>,
  additionalStubs?: Record<string, unknown>
) {
  return await render(component, {
    props,
    global: {
      stubs: {
        BtnIconsLabel: true,
        ...additionalStubs,
      },
    },
  });
}
