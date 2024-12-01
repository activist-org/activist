import type { PiniaResLocation } from "~/types/content/location";
import type {
  Group,
  PiniaResGroup,
  PiniaResGroupText,
} from "~/types/entities/group";
import type { PiniaResOrganization } from "~/types/entities/organization";

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

      locationId: "",
      lat: "",
      lon: "",
      bbox: [""],
      locationDisplayName: "",

      getInvolvedUrl: "",
      socialLinks: [""],
      creationDate: "",

      faqEntries: [""],

      description: "",
      getInvolved: "",
      donationPrompt: "",
    },

    groups: [],
  }),
  actions: {
    // MARK: Create

    async create() {},

    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;

      const [resGroup, resGroupOrg, resGroupTexts] = await Promise.all([
        useAsyncData(
          async () => await fetchWithoutToken(`/entities/groups/${id}`, {})
        ),
        useAsyncData(
          async () =>
            await fetchWithoutToken(
              `/entities/organizations?group_id=${id}`,
              {}
            )
        ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithoutToken(
        //       `/entities/group_faq?group_id=${id}`,
        //       {}
        //     )
        // ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithoutToken(
        //       `/entities/group_resources?group_id=${id}`,
        //       {}
        //     )
        // ),
        useAsyncData(
          async () =>
            await fetchWithoutToken(`/entities/group_texts?group_id=${id}`, {})
        ),
      ]);

      const groupRes = resGroup.data as unknown as PiniaResGroup;
      const groupOrgRes = resGroupOrg.data as unknown as PiniaResOrganization[];
      // const groupFAQRes = resGroupFAQ.data as unknown as PiniaResGroup;
      // const groupResourcesRes =
      //   resGroupResources.data as unknown as PiniaResGroup;
      const groupTextsRes = resGroupTexts.data as unknown as PiniaResGroupText;

      const group = groupRes._value;
      const groupOrg = groupOrgRes[0]._value;
      // const faq = groupRes._value;
      // const groups = groupRes._value;
      // const resources = groupRes._value;
      const texts = groupTextsRes._value.results[0];

      const groupLocation = (await Promise.all([
        useAsyncData(
          async () =>
            await fetchWithoutToken(
              `/content/locations/${group.locationId}`,
              {}
            )
        ),
      ])) as unknown as PiniaResLocation;

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
