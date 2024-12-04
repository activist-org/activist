import type { PiniaResLocation } from "~/types/content/location";
import type { Group, PiniaResGroup } from "~/types/entities/group";

interface GroupStore {
  loading: boolean;
  group: Group;
  groups: Group[];
}

export const useGroupStore = defineStore("group", {
  // MARK: Properties

  state: (): GroupStore => ({
    loading: false,

    group: {
      // group
      id: "",
      groupName: "",
      name: "",
      tagline: "",
      organization: "",
      createdBy: "",

      location: { id: "", lat: "", lon: "", bbox: [""], displayName: "" },

      getInvolvedUrl: "",
      socialLinks: [""],
      creationDate: "",

      faqEntries: [""],

      groupTextId: "",
      texts: {
        groupId: "",
        iso: "",
        primary: false,
        description: "",
        getInvolved: "",
        donationPrompt: "",
      },
    },

    groups: [],
  }),
  actions: {
    // MARK: Create

    async create() {},

    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;

      const groupRes = (
        await useAsyncData(
          async () => await fetchWithoutToken(`/entities/groups/${id}`, {})
        )
      ).data as unknown as PiniaResGroup;

      // const groupFAQRes = resGroupFAQ.data as unknown as PiniaResGroup;
      // const groupResourcesRes =
      //   resGroupResources.data as unknown as PiniaResGroup;

      const group = groupRes._value;
      // const faq = groupRes._value;
      // const groups = groupRes._value;
      // const resources = groupRes._value;

      const groupLocation = useAsyncData(
        async () =>
          await fetchWithoutToken(`/content/locations/${group.locationId}`, {})
      ) as unknown as PiniaResLocation;

      const location = groupLocation._value;

      this.group.id = group.id;
      this.group.name = group.name;
      this.group.tagline = group.tagline;
      this.group.organization = groupOrg.id;

      this.group.locationId = group.locationId;
      this.group.lat = location.lat;
      this.group.lon = location.lon;
      this.group.bbox = location.bbox;
      this.group.locationDisplayName = location.displayName;

      this.group.getInvolvedUrl = group.getInvolvedUrl;
      this.group.socialLinks = group.socialLinks;

      this.group.description = texts.description;
      this.group.getInvolved = texts.getInvolved;
      this.group.donationPrompt = texts.donationPrompt;

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
