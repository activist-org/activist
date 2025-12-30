// SPDX-License-Identifier: AGPL-3.0-or-later
import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";

import { useCreateGroupStore } from "../../app/stores";
import { CreateGroupSteps } from "../../shared/types";

// If these are "GroupDetails" and "Location" in your real file, this test will pass.

describe("useCreateGroupStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes at the GroupDetails step", () => {
    const store = useCreateGroupStore();
    store.start();

    expect(store.active).toBe(true);
    expect(store.nodeId).toBe(CreateGroupSteps.GroupDetails);
    expect(store.currentStep).toBe(1);
  });

  it("navigates from Details to Location", async () => {
    const store = useCreateGroupStore();
    store.start();

    // 1. Details -> Location
    await store.next({ name: "Vue Developers Meetup" });

    expect(store.nodeId).toBe(CreateGroupSteps.Location);
    expect(store.nodeData[CreateGroupSteps.GroupDetails]).toEqual({
      name: "Vue Developers Meetup",
    });
    expect(store.history).toContain(CreateGroupSteps.GroupDetails);
  });

  it("completes the flow and saves all data", async () => {
    const store = useCreateGroupStore();
    store.start();

    // 1. Fill Details
    await store.next({ name: "Final Group" });

    // 2. Fill Location and Finish
    await store.next({ city: "Paris", country: "France" });

    expect(store.isFinished).toBe(true);
    expect(store.active).toBe(false);
    expect(store.saveResult).toEqual({
      name: "Final Group",
      city: "Paris",
      country: "France",
    });
  });

  it("allows navigating back from Location to Details", async () => {
    const store = useCreateGroupStore();
    store.start();

    // Move to step 2
    await store.next();
    expect(store.nodeId).toBe(CreateGroupSteps.Location);

    // Move back
    store.prev();
    expect(store.nodeId).toBe(CreateGroupSteps.GroupDetails);
  });
});
