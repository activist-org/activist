// SPDX-License-Identifier: AGPL-3.0-or-later
import type {
  Group,
  GroupCreateFormData,
  GroupResponse,
  GroupsResponseBody,
  GroupUpdateTextFormData,
} from "~/types/communities/group";
import type { FaqEntry } from "~/types/content/faq-entry";
import type { SocialLinkFormData } from "~/types/content/social-link";

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
      org: {
        id: "",
        orgName: "",
        name: "",
        iconUrl: "",
      },
      createdBy: "",
      iconUrl: {
        id: "",
        fileObject: "",
        creation_date: "",
      },

      location: { id: "", lat: "", lon: "", bbox: [""], displayName: "" },

      getInvolvedUrl: "",
      socialLinks: [],
      creationDate: "",

      faqEntries: [],

      texts: {
        id: 0,
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
        `${BASE_BACKEND_URL}/communities/groups/`,
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

      const { data, status } = await useAsyncData<GroupResponse>(
        async () =>
          (await fetchWithoutToken(
            `/communities/groups/${id}/`,
            {}
          )) as GroupResponse
      );

      if (status.value === "success") {
        const group = data.value!;

        this.group.id = group.id;
        this.group.name = group.name;
        this.group.tagline = group.tagline;
        this.group.org = group.org;

        this.group.location = group.location;

        this.group.getInvolvedUrl = group.getInvolvedUrl;
        this.group.socialLinks = group.socialLinks;

        this.group.faqEntries = group.faqEntries;

        this.group.texts = group.texts[0];
      }

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const { data, status } = await useAsyncData<GroupsResponseBody>(
        async () =>
          (await fetchWithoutToken(
            `/communities/groups/`,
            {}
          )) as GroupsResponseBody
      );

      if (status.value === "success") {
        const groups = data.value!.results.map((group: GroupResponse) => {
          return {
            id: group.id,
            groupName: group.groupName,
            name: group.name,
            tagline: group.tagline,
            org: group.org,
            createdBy: group.createdBy,
            iconUrl: group.iconUrl,

            location: group.location,

            getInvolvedUrl: group.getInvolvedUrl,
            socialLinks: group.socialLinks,
            creationDate: group.creationDate,

            texts: group.texts[0],

            faqEntries: group.faqEntries,
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
        BASE_BACKEND_URL + `/communities/groups/${group.id}/`,
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
        BASE_BACKEND_URL + `/communities/group_texts/${group.texts.id}/`,
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

    // MARK: Update Social Links

    async updateSocialLinks(group: Group, formData: SocialLinkFormData[]) {
      this.loading = true;
      const responses: boolean[] = [];

      const token = localStorage.getItem("accessToken");

      // Endpoint needs socialLink id's but they are not available here.
      // 'update()' in the viewset 'class GroupSocialLinkViewSet' handles this
      // by using the group.id from the end of the URL.
      const responseSocialLinks = await useFetch(
        `${BASE_BACKEND_URL}/communities/group_social_links/${group.id}/`,
        {
          method: "PUT",
          // Send entire formData array/dict in order to make a single API request.
          body: JSON.stringify(
            formData.map((data) => ({
              link: data.link,
              label: data.label,
              order: data.order,
            }))
          ),
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const responseSocialLinksData = responseSocialLinks.data
        .value as unknown as Group;
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates, to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update FAQ Entries

    async updateFaqEntry(id: string, formData: FaqEntry) {
      this.loading = true;
      const result = await useFaqEntryStore().update("group", id, formData);
      if (result) {
        // Fetch updated organization data after successful updates, to update the frontend.
        await this.fetchById(id);
      }
      this.loading = false;
      return result;
    },

    // MARK: Delete

    async delete() {
      this.loading = true;

      this.loading = false;
    },
  },
});
