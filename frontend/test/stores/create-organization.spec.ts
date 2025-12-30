// SPDX-License-Identifier: AGPL-3.0-or-later
import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";

import { useCreateOrganizationStore } from "../../app/stores";
import { CreateOrganizationSteps } from "../../shared/types";

// If these are "OrganizationDetails" and "Location" in your real file, this test will pass.

describe("useCreateOrganizationStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes at the OrganizationDetails step", () => {
    const store = useCreateOrganizationStore();
    store.start();

    expect(store.active).toBe(true);
    expect(store.nodeId).toBe(CreateOrganizationSteps.OrganizationDetails);
    expect(store.currentStep).toBe(1);
  });

  it("navigates from Details to Location", async () => {
    const store = useCreateOrganizationStore();
    store.start();

    // 1. Details -> Location
    await store.next({ name: "Vue Developers Meetup" });

    expect(store.nodeId).toBe(CreateOrganizationSteps.Location);
    expect(store.nodeData[CreateOrganizationSteps.OrganizationDetails]).toEqual(
      { name: "Vue Developers Meetup" }
    );
    expect(store.history).toContain(
      CreateOrganizationSteps.OrganizationDetails
    );
  });

  it("completes the flow and saves all data", async () => {
    const store = useCreateOrganizationStore();
    store.start();

    // 1. Fill Details
    await store.next({ name: "Final Organization" });

    // 2. Fill Location and Finish
    await store.next({ city: "Paris", country: "France" });

    expect(store.isFinished).toBe(true);
    expect(store.active).toBe(false);
    expect(store.saveResult).toEqual({
      name: "Final Organization",
      city: "Paris",
      country: "France",
    });
  });

  it("allows navigating back from Location to Details", async () => {
    const store = useCreateOrganizationStore();
    store.start();

    // Move to step 2
    await store.next();
    expect(store.nodeId).toBe(CreateOrganizationSteps.Location);

    // Move back
    store.prev();
    expect(store.nodeId).toBe(CreateOrganizationSteps.OrganizationDetails);
  });
});
