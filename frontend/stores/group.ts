import type { PiniaResGroup, PiniaResGroupText } from "~/types/entities/group";
import type { PiniaResOrganization } from "~/types/entities/organization";

export const useGroupStore = defineStore("group", {
  // MARK: Properties

  state: () => ({
    loading: false,

    // group
    id: "",
    name: "",
    tagline: "",
    organization: "",
    location: "",
    getInvolvedURL: "",
    socialLinks: [""],
    status: 1,

    // group_text
    description: "",
    getInvolved: "",
    donationPrompt: "",
  }),
  actions: {
    async fetchByID(id: string | undefined) {
      // MARK: API Calls
      this.loading = true;

      const [resGroup, resGroupOrg, resGroupTexts] = await Promise.all([
        useAsyncData(
          async () => await fetchWithToken(`/entities/groups/${id}`, {})
        ),
        useAsyncData(
          async () =>
            await fetchWithToken(`/entities/organizations?group_id=${id}`, {})
        ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithToken(
        //       `/entities/group_faq?group_id=${id}`,
        //       {}
        //     )
        // ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithToken(
        //       `/entities/group_resources?group_id=${id}`,
        //       {}
        //     )
        // ),
        useAsyncData(
          async () =>
            await fetchWithToken(`/entities/group_texts?group_id=${id}`, {})
        ),
      ]);

      // MARK: Result Parsing

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

      // MARK: Assignment

      this.id = group.id;
      this.name = group.name;
      this.tagline = group.tagline;
      this.organization = groupOrg.id;
      this.location = group.location;
      this.getInvolvedURL = group.getInvolvedURL;
      this.socialLinks = group.socialLinks;

      this.description = texts.description;
      this.getInvolved = texts.getInvolved;
      this.donationPrompt = texts.donationPrompt;

      this.loading = false;
    },
    async fetchAll() {},
  },
});
