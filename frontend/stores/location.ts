import type { Location, PiniaResLocation } from "~/types/content/location";

interface LocationStore {
  loading: boolean;
  location: Location;
  locations: Location[];
}

export const useLocationStore = defineStore("location", {
  // MARK: Properties

  state: (): LocationStore => ({
    loading: false,

    location: {
      id: "",
      lat: "",
      lon: "",
      bbox: [""],
      displayName: "",
    },

    locations: [],
  }),
  actions: {
    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;

      const locationRes = (await useAsyncData(
        async () => await fetchWithoutToken(`/content/locations/${id}`, {})
      ).data) as unknown as PiniaResLocation;

      const location = locationRes._value;

      this.location.id = location.id;
      this.location.lat = location.lat;
      this.location.lon = location.lon;
      this.location.bbox = location.bbox;
      this.location.displayName = location.displayName;

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
