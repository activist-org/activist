// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

import { createImageStore } from "../factories/images";
import { createPaginationStore } from "../factories/pagination";

// MARK: List Store

export const useOrganizationListStore = createPaginationStore<
  Organization,
  OrganizationFilters
>("organization-list");

// MARK: Image Store

export const useOrganizationImageStore = createImageStore(
  "organization-images"
);

export const useOrganizationEventStore = defineStore("organization-events", {
  state: () => ({
    events: [] as Event[],
    entityId: null as string | null,
    filters: {} as { startDate?: string; endDate?: string; name?: string },
  }),
  actions: {
    getEntityId() {
      return this.entityId;
    },
    setEntityId(id: string) {
      this.entityId = id;
    },
    getEvents() {
      return this.events;
    },
    setEvents(events: Event[]) {
      this.events = events;
    },
    clearEvents() {
      this.events = [];
    },
    getFilters() {
      return this.filters;
    },
    setFilters(filters: {
      startDate?: string;
      endDate?: string;
      name?: string;
    }) {
      this.filters = filters;
    },
  },
});

// MARK: Entity Store

export const useOrganizationStore = defineStore("organization", {
  state: () => ({
    organization: null as unknown as Organization,
  }),
  actions: {
    getOrganization() {
      return this.organization;
    },
    setOrganization(org: Organization) {
      this.organization = org;
    },
  },
});
