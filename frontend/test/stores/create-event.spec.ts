// SPDX-License-Identifier: AGPL-3.0-or-later
import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";

import { useCreateEventStore } from "../../app/stores";
import { CreateEventSteps } from "../../shared/types";

describe("useCreateEventStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes at the EventDetails step", () => {
    const store = useCreateEventStore();
    store.start();

    expect(store.active).toBe(true);
    expect(store.nodeId).toBe(CreateEventSteps.EventDetails);
    expect(store.currentStep).toBe(1);
  });

  it("follows the 'Offline' path correctly", async () => {
    const store = useCreateEventStore();
    store.start();

    // Details -> Type
    await store.next({ name: "My Offline Event" });
    expect(store.nodeId).toBe(CreateEventSteps.EventType);

    // Type -> Logic Node (location_type: 'physical')
    await store.next({ location_type: "physical" });
    expect(store.nodeId).toBe(CreateEventSteps.OnlineOrPhysicalLocation);

    // Logic Node -> Location
    // Logic nodes require an execution tick.
    await store.next();
    expect(store.nodeId).toBe(CreateEventSteps.Location);

    // Location -> Time
    await store.next({ address: "123 Main St" });
    expect(store.nodeId).toBe(CreateEventSteps.Time);
  });

  it("follows the 'Online' path correctly", async () => {
    const store = useCreateEventStore();
    store.start();

    // Details -> Type
    await store.next({ name: "My Online Event" });

    // Type -> Logic Node (location_type: 'online')
    await store.next({ location_type: "online" });
    expect(store.nodeId).toBe(CreateEventSteps.OnlineOrPhysicalLocation);

    // Logic Node -> LinkOnline (Conditional Jump)
    await store.next();
    expect(store.nodeId).toBe(CreateEventSteps.LinkOnline);

    // LinkOnline -> Time
    await store.next({ link: "https://zoom.us/test" });
    expect(store.nodeId).toBe(CreateEventSteps.Time);
  });

  it("accumulates data from all steps into saveResult", async () => {
    const store = useCreateEventStore();
    store.start();

    // Step through the whole flow.
    await store.next({ name: "Final Event" }); // details
    await store.next({ location_type: "online" }); // type
    await store.next(); // logic (jump to Link)
    await store.next({ link: "http://test.com" }); // link
    await store.next({ date: "2024-01-01" }); // time

    // Time -> Action Node
    expect(store.nodeId).toBe(CreateEventSteps.CreateEventLoop);

    // Action Node -> End
    await store.next();

    expect(store.isFinished).toBe(true);
    expect(store.saveResult).toMatchObject({
      name: "Final Event",
      location_type: "online",
      link: "http://test.com",
      date: "2024-01-01",
    });
  });

  it("loops back to start if 'createAnother' is true", async () => {
    const store = useCreateEventStore();
    store.start();

    // Fast forward to Time step.
    store.goto(CreateEventSteps.Time);
    expect(store.nodeId).toBe(CreateEventSteps.Time);

    // Time -> Action Node (with createAnother: true)
    await store.next({ createAnother: true });
    expect(store.nodeId).toBe(CreateEventSteps.CreateEventLoop);

    // Simulate `useFlowScreens` injecting the API result into sharedData.
    store.setSharedData({ __lastActionResult: { id: "evt_123" } });

    // Action Node -> EventDetails (Loop)
    await store.next();

    expect(store.nodeId).toBe(CreateEventSteps.EventDetails);
    expect(store.sharedData.createdEventIds).toContain("evt_123");
    expect(store.sharedData.__lastActionResult).toBeNull(); // Should clean up
    expect(store.isFinished).toBe(false);
  });

  it("finishes flow if 'createAnother' is false", async () => {
    const store = useCreateEventStore();
    store.start();

    // Fast forward to Time step.
    store.goto(CreateEventSteps.Time);

    // Time -> Action Node
    await store.next({ createAnother: false });
    expect(store.nodeId).toBe(CreateEventSteps.CreateEventLoop);

    // Action Node -> End
    await store.next();
    expect(store.isFinished).toBe(true);
    expect(store.active).toBe(false);
  });
});
