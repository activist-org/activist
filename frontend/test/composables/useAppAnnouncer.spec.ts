// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { useAppAnnouncer } from "../../app/composables/generic/useAppAnnouncer";

describe("useAppAnnouncer composable", () => {
  it("provides announceMessage, announcePolite, and announceAssertive methods", () => {
    const announcer = useAppAnnouncer();
    expect(typeof announcer.announceMessage).toBe("function");
    expect(typeof announcer.announcePolite).toBe("function");
    expect(typeof announcer.announceAssertive).toBe("function");
  });

  it("handles missing useAnnouncer context gracefully", () => {
    const announcer = useAppAnnouncer();
    expect(() => announcer.announcePolite("Test message")).not.toThrow();
  });
});
