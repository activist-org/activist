// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import { menuItems } from "../../app/utils/navMenuItems";

describe("utils/navMenuItems", () => {
  // MARK: - Menu Structure

  it("defines three top-level nav items with labels, routes, and icons", () => {
    expect(menuItems).toHaveLength(3);
    expect(menuItems.map((m) => m.label)).toEqual([
      "i18n._global.home",
      "i18n._global.events",
      "i18n._global.organizations",
    ]);
    expect(menuItems.map((m) => m.routeUrl)).toEqual([
      "/home",
      "/events",
      "/organizations",
    ]);
    for (const m of menuItems) {
      expect(typeof m.iconUrl).toBe("string");
    }
  });
});
