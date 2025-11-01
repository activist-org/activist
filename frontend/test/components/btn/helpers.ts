// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Component } from "vue";

import render from "../../../test/render";
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
