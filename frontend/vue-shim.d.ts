// SPDX-License-Identifier: AGPL-3.0-or-later
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
