// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it } from "vitest";

import { useUser } from "../../app/composables/useUser";

beforeEach(() => {
  globalThis.data = { value: null };
});
describe("useUser composable", () => {
  it("returns correct values when no user is signed in", () => {
    const user = useUser();
    expect(user.userIsSignedIn).toBe(false);
    expect(user.userIsAdmin).toBe(false);
    expect(user.canEdit()).toBe(false);
    expect(user.canDelete()).toBe(false);
    expect(user.canCreate()).toBe(false);
    expect(user.canView()).toBe(true);
    expect(user.roles).toEqual([]);
  });

  it("returns correct values for admin user", () => {
    globalThis.data = { value: { user: { id: 1, isAdmin: true } } };
    const user = useUser();
    expect(user.userIsSignedIn).toBe(true);
    expect(user.userIsAdmin).toBe(true);
    expect(user.canEdit({ createdBy: 99 })).toBe(true);
    expect(user.canDelete({ createdBy: 99 })).toBe(true);
    expect(user.canCreate()).toBe(true);
    expect(user.canView()).toBe(true);
  });

  it("returns correct values for non-admin user (creator)", () => {
    globalThis.data = { value: { user: { id: 42, isAdmin: false } } };
    const user = useUser();
    expect(user.userIsSignedIn).toBe(true);
    expect(user.userIsAdmin).toBe(false);
    expect(user.canEdit({ createdBy: 42 })).toBe(true);
    expect(user.canDelete({ createdBy: 42 })).toBe(true);
    expect(user.canEdit({ createdBy: 99 })).toBe(false);
    expect(user.canDelete({ createdBy: 99 })).toBe(false);
    expect(user.canCreate()).toBe(true);
    expect(user.canView()).toBe(true);
  });

  it("canEdit/canDelete returns false if entity is undefined", () => {
    globalThis.data = { value: { user: { id: 22, isAdmin: false } } };
    const user = useUser();
    expect(user.canEdit(undefined)).toBe(false);
    expect(user.canDelete(undefined)).toBe(false);
  });
});
