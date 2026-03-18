// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

import { createImageStore } from "../factories/images";
import { createPaginationStore } from "../factories/pagination";

// 1. The List/Pagination Store
export const useOrganizationListStore = createPaginationStore<
  Organization,
  OrganizationFilters
>("organization-list");

// 2. The Images Store
export const useOrganizationImageStore = createImageStore(
  "organization-images"
);

// 3. The Core Entity Store (Now it only cares about the single active organization)
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
