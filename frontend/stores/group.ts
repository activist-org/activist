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
      location: "",
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
          async () => await fetchWithOptionalToken(`/entities/groups/${id}`, {})
        ),
        useAsyncData(
          async () =>
            await fetchWithOptionalToken(
              `/entities/organizations?group_id=${id}`,
              {}
            )
        ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithOptionalToken(
        //       `/entities/group_faq?group_id=${id}`,
        //       {}
        //     )
        // ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithOptionalToken(
        //       `/entities/group_resources?group_id=${id}`,
        //       {}
        //     )
        // ),
        useAsyncData(
          async () =>
            await fetchWithOptionalToken(
              `/entities/group_texts?group_id=${id}`,
              {}
            )
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

      this.group.id = group.id;
      this.group.name = group.name;
      this.group.tagline = group.tagline;
      this.group.organization = groupOrg.id;
      this.group.location = group.location;
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
