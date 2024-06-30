import type {
  Organization,
  OrganizationText,
  OrganizationTextFormData,
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

    // organization
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
    async fetchByID(id: string | undefined) {
      // MARK: Fetch By ID

      this.loading = true;

      const [resOrg, resOrgTexts] = await Promise.all([
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
      const orgRes = resOrg.data as unknown as PiniaResOrganization;
      // const orgFAQRes = resOrgFAQ.data as unknown as PiniaResOrganizationFAQ;
      // const orgGroupRes = resOrgGroups.data as unknown as PiniaResOrganizationGroup;
      // const orgResourcesRes =
      //   resOrgResources.data as unknown as PiniaResOrganizationResource;
      const orgTextsRes =
        resOrgTexts.data as unknown as PiniaResOrganizationText;

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
    async fetchAll() {
      // MARK: Fetch All

      this.loading = true;

      const [resOrgs] = await Promise.all([
        useAsyncData(
          async () => await fetchWithToken(`/entities/organizations/`, {})
        ),
      ]);

      const orgs = resOrgs.data as unknown as PiniaResOrganizations;

      if (orgs) {
        const resOrgTexts = (await Promise.all(
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

        const orgTextsData = resOrgTexts.map(
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
        this.loading = false;
      }
    },
    async save(organization: Organization) {
      // MARK: Save

      this.loading = true;

      this.loading = false;
    },
    async updateTexts(org: Organization, formData: OrganizationTextFormData) {
      // MARK: Update

      this.loading = true;

      const token = localStorage.getItem("accessToken");

      const resOrg = await $fetch(
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

      const resOrgTexts = await $fetch(
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

      if (resOrg && resOrgTexts) {
        this.organization.description = formData.description;
        this.organization.getInvolved = formData.getInvolved;
        this.organization.getInvolvedURL = formData.getInvolvedURL;

        this.loading = false;

        return true;
      }

      return false;
    },
    async delete(id: string | undefined) {
      // MARK: Delete

      this.loading = true;

      this.loading = false;
    },
  },
});
