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

    // 1. Details -> Type
    await store.next({ name: "My Offline Event" });
    expect(store.nodeId).toBe(CreateEventSteps.EventType);

    // 2. Type -> Logic Node (with location_type: 'physical')
    await store.next({ location_type: "physical" });
    expect(store.nodeId).toBe(CreateEventSteps.OnlineOrPhysicalLocation);

    // 3. Logic Node -> Location
    // (Logic nodes require an execution tick)
    await store.next();
    expect(store.nodeId).toBe(CreateEventSteps.Location);

    // 4. Location -> Time
    await store.next({ address: "123 Main St" });
    expect(store.nodeId).toBe(CreateEventSteps.Time);
  });

  it("follows the 'Online' path correctly", async () => {
    const store = useCreateEventStore();
    store.start();

    // 1. Details -> Type
    await store.next({ name: "My Online Event" });

    // 2. Type -> Logic Node (with location_type: 'online')
    await store.next({ location_type: "online" });
    expect(store.nodeId).toBe(CreateEventSteps.OnlineOrPhysicalLocation);

    // 3. Logic Node -> LinkOnline (Conditional Jump)
    await store.next();
    expect(store.nodeId).toBe(CreateEventSteps.LinkOnline);

    // 4. LinkOnline -> Time
    await store.next({ link: "https://zoom.us/test" });
    expect(store.nodeId).toBe(CreateEventSteps.Time);
  });

  it("accumulates data from all steps into saveResult", async () => {
    const store = useCreateEventStore();
    store.start();

    // Step through the whole flow
    await store.next({ name: "Final Event" }); // Details
    await store.next({ location_type: "online" }); // Type
    await store.next(); // Logic (jump to Link)
    await store.next({ link: "http://test.com" }); // Link
    await store.next({ date: "2024-01-01" }); // Time
    await store.next(); // Logic (End)

    expect(store.isFinished).toBe(true);
    expect(store.saveResult).toEqual({
      name: "Final Event",
      location_type: "online",
      link: "http://test.com",
      date: "2024-01-01",
    });
  });

  it("loops back to start if 'createAnother' is true", async () => {
    const store = useCreateEventStore();
    store.start();

    // Fast forward to Time step
    store.goto(CreateEventSteps.Time);
    expect(store.nodeId).toBe(CreateEventSteps.Time);

    // 1. Time -> Logic Node (with createAnother: true)
    await store.next({ createAnother: true });
    expect(store.nodeId).toBe(CreateEventSteps.CreateMoreEventsOrNot);

    // 2. Logic Node -> EventDetails (Loop)
    await store.next();
    expect(store.nodeId).toBe(CreateEventSteps.EventDetails);

    // 3. Should still be active
    expect(store.isFinished).toBe(false);
  });

  it("finishes flow if 'createAnother' is false", async () => {
    const store = useCreateEventStore();
    store.start();

    // Fast forward to Time step
    store.goto(CreateEventSteps.Time);

    // 1. Time -> Logic Node
    await store.next({ createAnother: false });
    expect(store.nodeId).toBe(CreateEventSteps.CreateMoreEventsOrNot);

    // 2. Logic Node -> End
    await store.next();
    expect(store.isFinished).toBe(true);
    expect(store.active).toBe(false);
  });
});
