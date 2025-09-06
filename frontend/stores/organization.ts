// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  Organization,
  OrganizationCreateFormData,
  OrganizationResponse,
  OrganizationsResponseBody,
  OrganizationUpdateTextFormData,
} from "~/types/communities/organization";
import type { FaqEntry } from "~/types/content/faq-entry";
import type { ContentImage, UploadableFile } from "~/types/content/file";
import type { Resource } from "~/types/content/resource";
import type { SocialLinkFormData } from "~/types/content/social-link";

import { EntityType } from "~/types/entity";

interface OrganizationStore {
  loading: boolean;
  organization: Organization;
  organizations: Organization[];
}
const { token } = useAuth();

export const useOrganizationStore = defineStore("organization", {
  // MARK: Properties

  state: (): OrganizationStore => ({
    loading: false,

    organization: {
      id: "",
      orgName: "",
      name: "",
      tagline: "",
      createdBy: "",
      iconUrl: {
        id: "",
        fileObject: "",
        creation_date: "",
      },

      location: { id: "", lat: "", lon: "", bbox: [""], displayName: "" },

      getInvolvedUrl: "",
      socialLinks: [],
      status: 1,
      creationDate: "",
      images: [],
      groups: [],
      events: [],
      resources: [],
      faqEntries: [],

      texts: {
        id: 0,
        orgId: "",
        iso: "",
        primary: false,
        description: "",
        getInvolved: "",
        donationPrompt: "",
      },
    },

    organizations: [],
  }),
  actions: {
    // MARK: Create

    async create(formData: OrganizationCreateFormData) {
      this.loading = true;

      const responseOrg = await useFetch(
        `${BASE_BACKEND_URL}/communities/organizations`,
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

      const responseOrgData = responseOrg.data.value as unknown as Organization;

      if (responseOrg) {
        this.loading = false;
        return responseOrgData.id;
      }

      this.loading = false;
      return false;
    },

    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;
      const { data, status } = await useAsyncData<OrganizationResponse>(
        async () =>
          (await fetchWithoutToken(
            `/communities/organizations/${id}`,
            {}
          )) as OrganizationResponse
      );

      if (status.value === "success") {
        const organization = data.value!;

        this.organization.id = organization.id;
        this.organization.orgName = organization.orgName;
        this.organization.name = organization.name;
        this.organization.tagline = organization.tagline;
        this.organization.iconUrl = organization.iconUrl;

        this.organization.location = organization.location;

        this.organization.getInvolvedUrl = organization.getInvolvedUrl;
        this.organization.socialLinks = organization.socialLinks;
        this.organization.status = organization.status;

        this.organization.texts = organization.texts[0];

        this.organization.groups = organization.groups;
        this.organization.events = organization.events;

        this.organization.resources = organization.resources;
        this.organization.faqEntries = organization.faqEntries;
      }

      this.loading = false;
    },

    // MARK: Create Resource

    async createResource(organization: Organization, formData: Resource) {
      this.loading = true;
      const responses: boolean[] = [];
      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/communities/organization_resources`,
        {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            org: organization.id,
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
        // Fetch updated event data after successful updates to update the frontend.
        await this.fetchById(organization.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update resource

    async updateResource(organization: Organization, formData: Resource) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/communities/organization_resources/${formData.id}`,
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
        // Fetch updated event data after successful updates to update the frontend.
        await this.fetchById(organization.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update Icon

    uploadIconImage: async function (id: string, file: UploadableFile) {
      if (!id) {
        return;
      }
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("entity_id", id);
        formData.append("entity_type", EntityType.ORGANIZATION);
        formData.append("file_object", file.file);
        const response = await useFetch(
          `${BASE_BACKEND_URL as string}/content/image_icon`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `${token.value}`,
            },
          }
        );
        if (response.data?.value) {
          this.fetchById(id);
          this.loading = false;
        }
      } catch (error) {
        void error;
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
      formData.append("entity_type", EntityType.ORGANIZATION);
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
          `${BASE_BACKEND_URL as string}/communities/organization/${entityId}/images/${image.id}`,
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
          `${BASE_BACKEND_URL as string}/communities/organization/${entityId}/images`,
          {
            headers: {
              Authorization: `${token.value}`,
            },
          }
        );

        if (response.data?.value) {
          const data = response.data.value as ContentImage[];
          this.organization.images = data;
        }
      } catch (error) {
        void error;
      }
    },

    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const { data, status } = await useAsyncData<OrganizationsResponseBody>(
        async () =>
          (await fetchWithoutToken(
            `/communities/organizations`,
            {}
          )) as OrganizationsResponseBody
      );

      if (status.value === "success") {
        const organizations = data.value!.results.map(
          (org: OrganizationResponse) => {
            return {
              id: org.id,
              orgName: org.orgName,
              name: org.name,
              tagline: org.tagline,
              createdBy: org.createdBy,
              iconUrl: org.iconUrl,

              location: org.location,

              getInvolvedUrl: org.getInvolvedUrl,
              socialLinks: org.socialLinks,
              status: org.status,
              creationDate: org.creationDate,

              groups: org.groups,
              events: org.events,
              faqEntries: org.faqEntries,

              texts: org.texts[0],
            };
          }
        );

        this.organizations = organizations;
      }

      this.loading = false;
    },

    // MARK: Update Texts

    async updateTexts(
      org: Organization,
      formData: OrganizationUpdateTextFormData
    ) {
      this.loading = true;

      const responseOrgTexts = await $fetch(
        BASE_BACKEND_URL + `/communities/organization_texts/${org.texts.id}`,
        {
          method: "PUT",
          body: {
            primary: true,
            description: formData.description,
            getInvolved: formData.getInvolved,
            donate_prompt: "",
            orgId: org.id,
            iso: "en",
          },
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      if (responseOrgTexts) {
        this.organization.texts.description = formData.description;
        this.organization.texts.getInvolved = formData.getInvolved;
        this.organization.getInvolvedUrl = formData.getInvolvedUrl;

        this.loading = false;

        return true;
      }

      return false;
    },

    // MARK: Delete Links

    // ATTN: Currently we're deleting the social links and rewriting all of them.
    async deleteSocialLinks(org: Organization) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseSocialLinks = useFetch(
        `${BASE_BACKEND_URL}/communities/organization_social_links`,
        {
          method: "DELETE",
          body: JSON.stringify({
            link: "https://www.example.com",
            label: "placeholder",
            org: org.id,
          }),
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      const responseSocialLinksData = responseSocialLinks.data
        .value as unknown as Organization;
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated org data after successful updates to update the frontend.
        await this.fetchById(org.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Create Links

    async createSocialLinks(org: Organization, formData: SocialLinkFormData[]) {
      this.loading = true;
      const responses: boolean[] = [];

      // Note: Map of the request sends individual requests for each social link to create the entry in the table.
      const responseSocialLinks = await Promise.all(
        formData.map((data) =>
          useFetch(
            `${BASE_BACKEND_URL}/communities/organization_social_links`,
            {
              method: "POST",
              body: JSON.stringify({
                link: data.link,
                label: data.label,
                order: data.order,
                org: org.id,
              }),
              headers: {
                Authorization: `${token.value}`,
              },
            }
          )
        )
      );

      const responseSocialLinksData = responseSocialLinks.map(
        (item) => item.data.value as unknown as Organization
      );
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated org data after successful updates to update the frontend.
        await this.fetchById(org.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update Links

    async updateSocialLinks(org: Organization, formData: SocialLinkFormData[]) {
      this.loading = true;
      const responses: boolean[] = [];

      // Note: Map of the request sends individual requests for each social link to the correct entry in the table.
      const responseSocialLinks = await Promise.all(
        formData.map((data) =>
          useFetch(
            `${BASE_BACKEND_URL}/communities/organization_social_links/${data.id}`,
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
        (item) => item.data.value as unknown as Organization
      );
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated organization data after successful updates to update the frontend.
        await this.fetchById(org.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Create FAQ

    async createFaqEntry(org: Organization, formData: FaqEntry) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/communities/organization_faqs`,
        {
          method: "POST",
          body: JSON.stringify({
            iso: formData.iso,
            order: formData.order,
            question: formData.question,
            answer: formData.answer,
            org: org.id,
          }),
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      const responseFaqEntriesData = responseFaqEntries.data
        .value as unknown as Organization;
      if (responseFaqEntriesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated org data after successful updates to update the frontend.
        await this.fetchById(org.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update FAQ

    async updateFaqEntry(org: Organization, formData: FaqEntry) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/communities/organization_faqs/${formData.id}`,
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
        .value as unknown as Organization;
      if (responseFaqEntriesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated org data after successful updates to update the frontend.
        await this.fetchById(org.id);
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

    // MARK: Reorder FAQ

    async reorderFaqEntries(org: Organization, faqEntries: FaqEntry[]) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFAQs = await Promise.all(
        faqEntries.map((faq) =>
          useFetch(
            `${BASE_BACKEND_URL}/communities/organization_faqs/${faq.id}`,
            {
              method: "PUT",
              body: JSON.stringify({
                id: faq.id,
                order: faq.order,
              }),
              headers: {
                Authorization: `${token.value}`,
              },
            }
          )
        )
      );

      const responseFAQsData = responseFAQs.map(
        (item) => item.data.value as unknown as Organization
      );
      if (responseFAQsData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(org.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Reorder resource

    async reorderResource(org: Organization, resources: Resource[]) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseResources = await Promise.all(
        resources.map((resource) =>
          useFetch(
            `${BASE_BACKEND_URL}/communities/organization_resources/${resource.id}`,
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
        (item) => item.data.value as unknown as Organization
      );
      if (responseResourcesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated group data after successful updates to update the frontend.
        await this.fetchById(org.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },
  },
});
