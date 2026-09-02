// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

import { createImageStore } from "../factories/images";

// MARK: Image Store

export const useOrganizationImageStore = createImageStore(
  "organization-images"
);

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
