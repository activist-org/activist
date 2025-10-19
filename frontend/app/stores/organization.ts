// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Organization } from "~/types/communities/organization";
import type { ContentImage } from "~/types/content/file";

interface OrganizationStore {
  organization: Organization;
  organizations: Organization[];
  images: ContentImage[];
}

export const useOrganizationStore = defineStore("organization", {
  state: (): OrganizationStore => ({
    organization: null as unknown as Organization,
    images: [] as ContentImage[],
    organizations: [],
  }),
  actions: {
    // MARK: Set Organizations
    setOrganizations(organizations: Organization[]) {
      this.organizations = organizations;
    },
    setOrganization(organization: Organization) {
      this.organization = organization;
    },
    getOrganization() {
      return this.organization;
    },
    // MARK: Get Organizations
    getOrganizations() {
      return this.organizations;
    },
    getImages() {
      return this.images;
    },
    // MARK: Clear
    setImages(images: ContentImage[]) {
      this.images = images;
    },
    clearImages() {
      this.images = [];
    },
  },
});
