import type {
  Organization,
  OrganizationCreateFormData,
  OrganizationText,
  OrganizationUpdateTextFormData,
  PiniaResOrganization,
  PiniaResOrganizationEvents,
  PiniaResOrganizationText,
  PiniaResOrganizationTexts,
  PiniaResOrganizations,
} from "~/types/entities/organization";

interface OrganizationStore {
  loading: boolean;
  organization: Organization;
  organizations: Organization[];
}

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
      iconUrl: "",
      location: "",
      getInvolvedUrl: "",
      socialLinks: [""],
      status: 1,
      groups: [],

      organizationTextId: "",
      description: "",
      getInvolved: "",
      donationPrompt: "",
    },

    organizations: [],
  }),
  actions: {
    // MARK: Create

    async create(formData: OrganizationCreateFormData) {
      this.loading = true;

      const token = localStorage.getItem("accessToken");

      const responseOrg = await useFetch(
        `${BASE_BACKEND_URL}/entities/organizations/`,
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

      const responseOrgData = responseOrg.data.value as unknown as Organization;

      if (responseOrg) {
        this.loading = false;

        return responseOrgData.id;
      }

      return false;
    },

    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;

      const [responseOrg, responseOrgTexts, responseOrgEvents] =
        await Promise.all([
          useAsyncData(
            async () =>
              await fetchWithOptionalToken(`/entities/organizations/${id}`, {})
          ),
          useAsyncData(
            async () =>
              await fetchWithOptionalToken(
                `/entities/organization_texts?org_id=${id}`,
                {}
              )
          ),
          useAsyncData(
            async () =>
              await fetchWithOptionalToken(
                `/entities/organization_events?org_id=${id}`,
                {}
              )
          ),
          // useAsyncData(
          //   async () =>
          //     await fetchWithOptionalToken(
          //       `/entities/organization_faq?org_id=${id}`,
          //       {}
          //     )
          // ),
          // useAsyncData(
          //   async () =>
          //     await fetchWithOptionalToken(
          //       `/entities/organization_resources?org_id=${id}`,
          //       {}
          //     )
          // ),
        ]);
      const orgRes = responseOrg.data as unknown as PiniaResOrganization;
      const orgTextsRes =
        responseOrgTexts.data as unknown as PiniaResOrganizationText;
      const orgEventsRes =
        responseOrgEvents.data as unknown as PiniaResOrganizationEvents;
      // const orgGroupRes = responseOrgGroups.data as unknown as PiniaResOrganizationGroup;
      // const orgFAQRes = responseOrgFAQ.data as unknown as PiniaResOrganizationFAQ;
      // const orgResourcesRes =
      //   responseOrgResources.data as unknown as PiniaResOrganizationResource;

      const organization = orgRes._value;
      const texts = orgTextsRes._value.results[0];
      const events = orgEventsRes._value.results;
      // const faq = orgRes._value;
      // const groups = orgRes._value;
      // const resources = orgRes._value;

      this.organization.id = organization.id;
      this.organization.orgName = organization.orgName;
      this.organization.name = organization.name;
      this.organization.tagline = organization.tagline;
      this.organization.iconUrl = organization.iconUrl;
      this.organization.location = organization.location;
      this.organization.getInvolvedUrl = organization.getInvolvedUrl;
      this.organization.socialLinks = organization.socialLinks;
      this.organization.status = organization.status;

      this.organization.organizationTextId = texts.id;
      this.organization.description = texts.description;
      this.organization.getInvolved = texts.getInvolved;
      this.organization.donationPrompt = texts.donationPrompt;

      this.organization.groups = organization.groups;
      this.organization.events = events;

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const [responseOrgs] = await Promise.all([
        useAsyncData(
          async () =>
            await fetchWithOptionalToken(`/entities/organizations/`, {})
        ),
      ]);

      const orgs = responseOrgs.data as unknown as PiniaResOrganizations;

      if (orgs._value) {
        const responseOrgTexts = (await Promise.all([
          useAsyncData(
            async () =>
              await fetchWithOptionalToken(`/entities/organization_texts/`, {})
          ),
        ])) as unknown as PiniaResOrganizationTexts[];

        const orgTextsData = responseOrgTexts.map(
          (text) => text.data._value.results
        )[0] as unknown as OrganizationText[];

        // Order texts based on the returned organizations.
        const orgIds = orgs._value.map((o) => o.id);
        const sortedOrgTextsData: OrganizationText[] = [];
        for (const id of orgIds) {
          for (const text of orgTextsData) {
            if (text.orgId === id) {
              sortedOrgTextsData.push(text);
            }
          }
        }

        const organizationsWithTexts = orgs._value.map(
          (organization: Organization, index: number) => {
            const texts = sortedOrgTextsData[index];
            return {
              id: organization.id,
              orgName: organization.orgName,
              name: organization.name,
              tagline: organization.tagline,
              createdBy: organization.createdBy,
              iconUrl: organization.iconUrl,
              location: organization.location,
              getInvolvedUrl: organization.getInvolvedUrl,
              socialLinks: organization.socialLinks,
              status: organization.status,
              groups: organization.groups,

              organizationTextId: texts.id,
              description: texts.description,
              getInvolved: texts.getInvolved,
              donationPrompt: texts.donationPrompt,
            };
          }
        );

        this.organizations = organizationsWithTexts;
      }

      this.loading = false;
    },

    // MARK: Update

    async updateTexts(
      org: Organization,
      formData: OrganizationUpdateTextFormData
    ) {
      this.loading = true;

      const token = localStorage.getItem("accessToken");

      const responseOrg = await $fetch(
        BASE_BACKEND_URL + `/entities/organizations/${org.id}/`,
        {
          method: "PUT",
          body: {
            ...org,
            getInvolvedUrl: formData.getInvolvedUrl,
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const responseOrgTexts = await $fetch(
        BASE_BACKEND_URL +
          `/entities/organization_texts/${org.organizationTextId}/`,
        {
          method: "PUT",
          body: {
            primary: true,
            description: formData.description,
            getInvolved: formData.getInvolved,
            donate_prompt: "",
            org_id: org.id,
            iso: "en",
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (responseOrg && responseOrgTexts) {
        this.organization.description = formData.description;
        this.organization.getInvolved = formData.getInvolved;
        this.organization.getInvolvedUrl = formData.getInvolvedUrl;

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
