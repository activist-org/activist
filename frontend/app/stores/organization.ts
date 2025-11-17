// SPDX-License-Identifier: AGPL-3.0-or-later
interface OrganizationStore {
  organization: Organization;
  organizations: Organization[];
  images: ContentImage[];
  filters: OrganizationFilters;
}

export const useOrganizationStore = defineStore("organization", {
  state: (): OrganizationStore => ({
    organization: null as unknown as Organization,
    images: [] as ContentImage[],
    organizations: [],
    filters: {} as OrganizationFilters,
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
    getFilters() {
      return this.filters;
    },
    setFilters(filters: OrganizationFilters) {
      this.filters = filters;
    },
  },
});
