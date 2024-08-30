import type {
  Organization,
  OrganizationCreateFormData,
  OrganizationText,
  OrganizationUpdateTextFormData,
  PiniaResOrganization,
  PiniaResOrganizations,
  PiniaResOrganizationText,
  PiniaResOrganizationTexts,
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
      name: "",
      tagline: "",
      createdBy: "",
      iconURL: "",
      location: "",
      getInvolvedURL: "",
      socialLinks: [""],
      status: 1,
      groups: [],

      organization_text_id: "",
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

    async fetchByID(id: string | undefined) {
      this.loading = true;

      const [responseOrg, responseOrgTexts] = await Promise.all([
        useAsyncData(
          async () => await fetchWithToken(`/entities/organizations/${id}`, {})
        ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithToken(
        //       `/entities/organization_faq?org_id=${id}`,
        //       {}
        //     )
        // ),
        // useAsyncData(
        //   async () => await fetchWithToken(`/entities/groups?org_id=${id}`, {})
        // ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithToken(
        //       `/entities/organization_resources?org_id=${id}`,
        //       {}
        //     )
        // ),
        useAsyncData(
          async () =>
            await fetchWithToken(
              `/entities/organization_texts?org_id=${id}`,
              {}
            )
        ),
      ]);
      const orgRes = responseOrg.data as unknown as PiniaResOrganization;
      // const orgFAQRes = responseOrgFAQ.data as unknown as PiniaResOrganizationFAQ;
      // const orgGroupRes = responseOrgGroups.data as unknown as PiniaResOrganizationGroup;
      // const orgResourcesRes =
      //   responseOrgResources.data as unknown as PiniaResOrganizationResource;
      const orgTextsRes =
        responseOrgTexts.data as unknown as PiniaResOrganizationText;

      const organization = orgRes._value;
      // const faq = orgRes._value;
      // const groups = orgRes._value;
      // const resources = orgRes._value;
      const texts = orgTextsRes._value.results[0];

      this.organization.id = organization.id;
      this.organization.name = organization.name;
      this.organization.tagline = organization.tagline;
      this.organization.iconURL = organization.iconURL;
      this.organization.location = organization.location;
      this.organization.getInvolvedURL = organization.getInvolvedURL;
      this.organization.socialLinks = organization.socialLinks;
      this.organization.status = organization.status;

      this.organization.groups = organization.groups;

      this.organization.description = texts.description;
      this.organization.getInvolved = texts.getInvolved;
      this.organization.donationPrompt = texts.donationPrompt;
      this.organization.organization_text_id = texts.id;

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const [responseOrgs] = await Promise.all([
        useAsyncData(
          async () => await fetchWithToken(`/entities/organizations/`, {})
        ),
      ]);

      const orgs = responseOrgs.data as unknown as PiniaResOrganizations;

      if (orgs._value) {
        const responseOrgTexts = (await Promise.all(
          orgs._value.map((org) =>
            useAsyncData(
              async () =>
                await fetchWithToken(
                  `/entities/organization_texts?org_id=${org.id}`,
                  {}
                )
            )
          )
        )) as unknown as PiniaResOrganizationTexts[];

        const orgTextsData = responseOrgTexts.map(
          (text) => text.data._value.results[0]
        ) as unknown as OrganizationText[];

        console.log(`Here: ${JSON.stringify(orgTextsData)}`);

        const organizationsWithTexts = orgs._value.map(
          (organization: Organization, index: number) => {
            const texts = orgTextsData[index];
            return {
              id: organization.id,
              name: organization.name,
              tagline: organization.tagline,
              createdBy: organization.createdBy,
              iconURL: organization.iconURL,
              location: organization.location,
              getInvolvedURL: organization.getInvolvedURL,
              socialLinks: organization.socialLinks,
              status: organization.status,
              groups: organization.groups,
              organization_text_id: organization.organization_text_id,
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
            getInvolvedURL: formData.getInvolvedURL,
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const responseOrgTexts = await $fetch(
        BASE_BACKEND_URL +
          `/entities/organization_texts/${org.organization_text_id}/`,
        {
          method: "PUT",
          body: {
            primary: true,
            description: formData.description,
            getInvolved: formData.getInvolved,
            donate_prompt: "",
            org_id: org.id,
            iso: 1,
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (responseOrg && responseOrgTexts) {
        this.organization.description = formData.description;
        this.organization.getInvolved = formData.getInvolved;
        this.organization.getInvolvedURL = formData.getInvolvedURL;

        this.loading = false;

        return true;
      }

      return false;
    },

    // MARK: Delete

    async delete(id: string | undefined) {
      this.loading = true;

      this.loading = false;
    },
  },
});
