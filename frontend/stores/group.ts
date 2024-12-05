import type {
  Group,
  GroupCreateFormData,
  GroupUpdateTextFormData,
  PiniaResGroup,
  PiniaResGroups,
} from "~/types/entities/group";

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
      iconUrl: "",

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

    async create(formData: GroupCreateFormData) {
      this.loading = true;

      const token = localStorage.getItem("accessToken");

      const responseGroup = await useFetch(
        `${BASE_BACKEND_URL}/entities/groups/`,
        {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            location: formData.location,
            tagline: formData.tagline,
            social_accounts: formData.social_accounts,
            created_by: "cdfecc96-2dd5-435b-baba-a7610afee70e",
            description: formData.description,
            topics: formData.topics,
            high_risk: false,
            total_flags: 0,
            acceptance_date: new Date(),
          }),
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const responseGroupData = responseGroup.data.value as unknown as Group;

      if (responseGroup) {
        this.loading = false;
        return responseGroupData.id;
      }

      this.loading = false;
      return false;
    },

    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;

      const groupRes = (
        await useAsyncData(
          async () => await fetchWithoutToken(`/entities/groups/${id}`, {})
        )
      ).data as unknown as PiniaResGroup;

      const group = groupRes._value;

      this.group.id = group.id;
      this.group.name = group.name;
      this.group.tagline = group.tagline;
      this.group.organization = group.organization;

      this.group.location = group.location;

      this.group.getInvolvedUrl = group.getInvolvedUrl;
      this.group.socialLinks = group.socialLinks;

      this.group.groupTextId = group.texts.groupId;
      this.group.texts = group.texts;

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const responseGroups = await useAsyncData(
        async () => await fetchWithoutToken(`/entities/groups/`, {})
      );

      const allGroups = responseGroups.data as unknown as PiniaResGroups;

      if (allGroups._value) {
        const groups = allGroups._value.map((group: Group) => {
          return {
            id: group.id,
            groupName: group.groupName,
            name: group.name,
            tagline: group.tagline,
            organization: group.organization,
            createdBy: group.createdBy,
            iconUrl: group.iconUrl,

            location: group.location,

            getInvolvedUrl: group.getInvolvedUrl,
            socialLinks: group.socialLinks,
            creationDate: group.creationDate,

            groupTextId: group.texts.groupId,
            texts: group.texts,
          };
        });

        this.groups = groups;
      }

      this.loading = false;
    },

    // MARK: Update Texts

    async updateTexts(group: Group, formData: GroupUpdateTextFormData) {
      this.loading = true;

      const token = localStorage.getItem("accessToken");

      const responseOrg = await $fetch(
        BASE_BACKEND_URL + `/entities/groups/${group.id}/`,
        {
          method: "PUT",
          body: {
            ...group,
            getInvolvedUrl: formData.getInvolvedUrl,
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const responseOrgTexts = await $fetch(
        BASE_BACKEND_URL + `/entities/organization_texts/${group.groupTextId}/`,
        {
          method: "PUT",
          body: {
            primary: true,
            description: formData.description,
            getInvolved: formData.getInvolved,
            donate_prompt: "",
            orgId: group.id,
            iso: "en",
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (responseOrg && responseOrgTexts) {
        this.group.texts.description = formData.description;
        this.group.texts.getInvolved = formData.getInvolved;
        this.group.getInvolvedUrl = formData.getInvolvedUrl;

        this.loading = false;

        return true;
      }

      return false;
    },

    // MARK: Delete

    async delete() {
      this.loading = true;

      this.loading = false;
    },
  },
});
