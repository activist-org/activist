// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUser } from "../../app/composables/useUser";
import { createUseUserSessionMock } from "../mocks/composableMocks";

beforeEach(() => {
  // Default: user is logged out.
  globalThis.useUserSession = createUseUserSessionMock();
});

describe("useUser composable", () => {
  it("returns correct values when no user is signed in", () => {
    const user = useUser();
    expect(user.userIsSignedIn.value).toBe(false);
    expect(user.userIsAdmin.value).toBe(false);
    expect(user.canEdit()).toBe(false);
    expect(user.canDelete()).toBe(false);
    expect(user.canCreate()).toBe(false);
    expect(user.canView()).toBe(true);
    expect(user.roles).toEqual([]);
  });

  it("returns correct values for admin user", () => {
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 1,
      isAdmin: true,
    });
    const user = useUser();
    expect(user.userIsSignedIn.value).toBe(true);
    expect(user.userIsAdmin.value).toBe(true);
    expect(user.canEdit({ createdBy: 99 })).toBe(true);
    expect(user.canDelete({ createdBy: 99 })).toBe(true);
    expect(user.canCreate()).toBe(true);
    expect(user.canView()).toBe(true);
  });

  it("returns correct values for non-admin user (creator)", () => {
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 42,
      isAdmin: false,
    });
    const user = useUser();
    expect(user.userIsSignedIn.value).toBe(true);
    expect(user.userIsAdmin.value).toBe(false);
    expect(user.canEdit({ createdBy: 42 })).toBe(true);
    expect(user.canDelete({ createdBy: 42 })).toBe(true);
    expect(user.canEdit({ createdBy: 99 })).toBe(false);
    expect(user.canDelete({ createdBy: 99 })).toBe(false);
    expect(user.canCreate()).toBe(true);
    expect(user.canView()).toBe(true);
  });

  it("canEdit/canDelete returns false if entity is undefined", () => {
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 22,
      isAdmin: false,
    });
    const user = useUser();
    expect(user.canEdit(undefined)).toBe(false);
    expect(user.canDelete(undefined)).toBe(false);
  });
});
