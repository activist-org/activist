// SPDX-License-Identifier: AGPL-3.0-or-later
interface LocationStore {
  loading: boolean;
  location: PhysicalLocation;
  locations: PhysicalLocation[];
}

export const useLocationStore = defineStore("location", {
  // MARK: Properties

  state: (): LocationStore => ({
    loading: false,

    location: null as unknown as PhysicalLocation,

    locations: [],
  }),
  actions: {
    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;

      const locationRes = (await useAsyncData(
        async () => await fetchSession(`/content/locations/${id}`, {})
      ).data) as unknown as PiniaResLocation;

      const location = locationRes._value;

      this.location = location;

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {},

    // MARK: Update

    async update() {},

    // MARK: Delete

    async delete() {},
  },
});
