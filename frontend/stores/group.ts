// SPDX-License-Identifier: AGPL-3.0-or-later
import type {
  Group,
  GroupCreateFormData,
  GroupResponse,
  GroupsResponseBody,
  GroupUpdateTextFormData,
} from "~/types/communities/group";
import type { FaqEntry } from "~/types/content/faq-entry";
import type { ContentImage, UploadableFile } from "~/types/content/file";
import type { Resource } from "~/types/content/resource";
import type { SocialLinkFormData } from "~/types/content/social-link";

import { EntityType } from "~/types/entity";

interface GroupStore {
  loading: boolean;
  group: Group;
  groups: Group[];
}
const { token } = useAuth();

export const useGroupStore = defineStore("group", {
  // MARK: Properties

  state: (): GroupStore => ({
    loading: false,

    group: {
      id: "",
      images: [],
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

      events: [],
      resources: [],
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

      const responseGroup = await useFetch(
        `${BASE_BACKEND_URL}/communities/groups`,
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
            Authorization: `${token.value}`,
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
            `/communities/groups/${id}`,
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

        this.group.texts = group.texts[0];

        this.group.resources = group.resources;
        this.group.faqEntries = group.faqEntries;
      }

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const { data, status } = await useAsyncData<GroupsResponseBody>(
        async () =>
          (await fetchWithoutToken(
            `/communities/groups`,
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

      const responseOrgTexts = await $fetch(
        BASE_BACKEND_URL + `/communities/group_texts/${group.texts.id}`,
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
            Authorization: `${token.value}`,
          },
        }
      );

      if (responseOrgTexts) {
        this.group.texts.description = formData.description;
        this.group.texts.getInvolved = formData.getInvolved;
        this.group.getInvolvedUrl = formData.getInvolvedUrl;

        this.loading = false;

        return true;
      }

      return false;
    },

    // MARK: Reorder resource

    async reorderResource(group: Group, resources: Resource[]) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseResources = await Promise.all(
        resources.map((resource) =>
          useFetch(
            `${BASE_BACKEND_URL}/communities/group_resources/${resource.id}`,
            {
              method: "PUT",
              body: JSON.stringify({
                id: resource.id,
                order: resource.order,
              }),
              headers: {
                Authorization: `${token.value}`,
              },
            }
          )
        )
      );

      const responseResourcesData = responseResources.map(
        (item) => item.data.value as unknown as Group
      );
      if (responseResourcesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Create Resource

    async createResource(group: Group, formData: Resource) {
      this.loading = true;
      const responses: boolean[] = [];
      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/communities/group_resources`,
        {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            group: group.id,
          }),
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      const responseResourcesData = responseFaqEntries.data
        .value as unknown as Event;
      if (responseResourcesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update resource

    async updateResource(group: Group, formData: Resource) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/communities/group_resources/${formData.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...formData,
          }),
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      const responseFaqEntriesData = responseFaqEntries.data
        .value as unknown as Event;
      if (responseFaqEntriesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Delete Links

    // ATTN: Currently we're deleting the social links and rewriting all of them.
    async deleteSocialLinks(group: Group) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseSocialLinks = useFetch(
        `${BASE_BACKEND_URL}/communities/group_social_links`,
        {
          method: "DELETE",
          body: JSON.stringify({
            link: "https://www.example.com",
            label: "placeholder",
            group: group.id,
          }),
          headers: {
            Authorization: `${token.value}`,
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
        // Fetch updated org data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Upload Files

    uploadFiles: async function (
      id: string,
      files: UploadableFile[],
      sequences: number[] = []
    ) {
      if (!id) {
        return;
      }
      this.loading = true;
      const formData = new FormData();

      // Entities are handled in backend/content/serializers.py ImageSerializer.create().
      formData.append("entity_id", id);
      formData.append("entity_type", EntityType.GROUP);
      sequences.forEach((sequence) =>
        formData.append("sequences", sequence.toString())
      );

      files.forEach((uploadableFile: UploadableFile) => {
        formData.append("file_object", uploadableFile.file);
      });
      try {
        const response = await useFetch(
          `${BASE_BACKEND_URL as string}/content/images`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `${token.value}`,
            },
          }
        );

        if (response.data?.value) {
          const data = response.data.value as ContentImage[];
          if (data.length > 0) {
            await this.fetchImages(id);
            this.loading = false;
          }
          return data;
        }
      } catch (error) {
        void error;
      }
    },

    // MARK: Update Images

    updateImage: async function (entityId: string, image: ContentImage) {
      if (!entityId) {
        return;
      }
      this.loading = true;
      try {
        const response = await useFetch(
          `${BASE_BACKEND_URL as string}/communities/group/${entityId}/images/${image.id}`,
          {
            method: "PUT",
            body: image,
            headers: {
              Authorization: `${token.value}`,
            },
          }
        );

        if (response.data?.value) {
          await this.fetchImages(entityId);
          this.loading = false;
        }
      } catch (error) {
        void error;
      }
    },

    // MARK: Fetch Images

    fetchImages: async function (entityId: string) {
      if (!entityId) {
        return;
      }

      try {
        const response = await useFetch(
          `${BASE_BACKEND_URL as string}/communities/group/${entityId}/images`,
          {
            headers: {
              Authorization: `${token.value}`,
            },
          }
        );
        if (response.data?.value) {
          const data = response.data.value as ContentImage[];
          this.group.images = data;
        }
      } catch (error) {
        void error;
      }
    },

    // MARK: Create Links

    async createSocialLinks(group: Group, formData: SocialLinkFormData[]) {
      this.loading = true;
      const responses: boolean[] = [];

      // Note: Map of the request sends individual requests for each social link to create the entry in the table.
      const responseSocialLinks = await Promise.all(
        formData.map((data) =>
          useFetch(`${BASE_BACKEND_URL}/communities/group_social_links`, {
            method: "POST",
            body: JSON.stringify({
              link: data.link,
              label: data.label,
              order: data.order,
              group: group.id,
            }),
            headers: {
              Authorization: `${token.value}`,
            },
          })
        )
      );

      const responseSocialLinksData = responseSocialLinks.map(
        (item) => item.data.value as unknown as Group
      );
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated org data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update Links

    async updateSocialLinks(group: Group, formData: SocialLinkFormData[]) {
      this.loading = true;
      const responses: boolean[] = [];

      // Note: Map of the request sends individual requests for each social link to the correct entry in the table.
      const responseSocialLinks = await Promise.all(
        formData.map((data) =>
          useFetch(
            `${BASE_BACKEND_URL}/communities/group_social_links/${data.id}`,
            {
              method: "PUT",
              body: JSON.stringify({
                link: data.link,
                label: data.label,
                order: data.order,
              }),
              headers: {
                Authorization: `${token.value}`,
              },
            }
          )
        )
      );

      const responseSocialLinksData = responseSocialLinks.map(
        (item) => item.data.value as unknown as Group
      );
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Create FAQ

    async createFaqEntry(group: Group, formData: FaqEntry) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/communities/group_faqs`,
        {
          method: "POST",
          body: JSON.stringify({
            iso: formData.iso,
            order: formData.order,
            question: formData.question,
            answer: formData.answer,
            group: group.id,
          }),
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      const responseFaqEntriesData = responseFaqEntries.data
        .value as unknown as Group;
      if (responseFaqEntriesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update FAQ

    async updateFaqEntry(group: Group, formData: FaqEntry) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/communities/group_faqs/${formData.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: formData.id,
            question: formData.question,
            answer: formData.answer,
          }),
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      const responseFaqEntriesData = responseFaqEntries.data
        .value as unknown as Group;
      if (responseFaqEntriesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Delete

    async delete() {
      this.loading = true;

      this.loading = false;
    },

    // MARK: Reorder FAQs

    async reorderFaqEntries(group: Group, faqEntries: FaqEntry[]) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFAQs = await Promise.all(
        faqEntries.map((faq) =>
          useFetch(`${BASE_BACKEND_URL}/communities/group_faqs/${faq.id}`, {
            method: "PUT",
            body: JSON.stringify({
              id: faq.id,
              order: faq.order,
            }),
            headers: {
              Authorization: `${token.value}`,
            },
          })
        )
      );

      const responseFAQsData = responseFAQs.map(
        (item) => item.data.value as unknown as Group
      );
      if (responseFAQsData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(group.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },
  },
});
