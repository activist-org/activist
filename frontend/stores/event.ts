// SPDX-License-Identifier: AGPL-3.0-or-later
import type { FaqEntry } from "~/types/content/faq-entry";
import type { SocialLinkFormData } from "~/types/content/social-link";
import type {
  Event,
  EventCreateFormData,
  EventResponse,
  EventsResponseBody,
  EventUpdateTextFormData,
} from "~/types/events/event";

interface EventStore {
  loading: boolean;
  event: Event;
  events: Event[];
}
const { token } = useAuth();

export const useEventStore = defineStore("event", {
  // MARK: Properties

  state: (): EventStore => ({
    loading: false,

    event: {
      id: "",
      name: "",
      tagline: "",
      createdBy: "",
      iconUrl: {
        id: "",
        fileObject: "",
        creation_date: "",
      },
      type: "learn",
      onlineLocationLink: "",

      offlineLocation: {
        id: "",
        lat: "",
        lon: "",
        bbox: [""],
        displayName: "",
      },

      getInvolvedUrl: "",
      socialLinks: [],
      faqEntries: [],
      startTime: "",
      endTime: "",
      creationDate: "",

      orgs: { id: "", orgName: "", name: "", iconUrl: "" },

      texts: {
        id: 0,
        eventId: "",
        iso: "",
        primary: false,
        description: "",
        getInvolved: "",
      },
    },

    events: [],
  }),
  actions: {
    // MARK: Create

    async create(formData: EventCreateFormData) {
      this.loading = true;

      const responseEvent = await useFetch(
        `${BASE_BACKEND_URL}/events/events`,
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

      const responseEventData = responseEvent.data.value as unknown as Event;

      if (responseEvent) {
        this.loading = false;
        return responseEventData.id;
      }

      this.loading = false;
      return false;
    },

    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;
      const { data, status } = await useAsyncData<EventResponse>(
        async () =>
          (await fetchWithoutToken(`/events/events/${id}`, {})) as EventResponse
      );

      if (status.value === "success") {
        const event = data.value!;

        this.event.id = event.id;
        this.event.name = event.name;
        this.event.tagline = event.tagline;
        this.event.createdBy = event.createdBy;
        this.event.iconUrl = event.iconUrl;
        this.event.type = event.type;

        this.event.offlineLocation = event.offlineLocation;
        this.event.getInvolvedUrl = event.getInvolvedUrl;

        this.event.getInvolvedUrl = event.getInvolvedUrl;
        this.event.socialLinks = event.socialLinks;
        this.event.faqEntries = event.faqEntries;
        this.event.startTime = event.startTime;
        this.event.endTime = event.endTime;
        this.event.creationDate = event.creationDate;
        this.event.orgs = event.orgs;

        this.event.texts = event.texts[0];
      }

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const { data, status } = await useAsyncData<EventsResponseBody>(
        async () =>
          (await fetchWithoutToken(`/events/events`, {})) as EventsResponseBody
      );

      if (status.value === "success") {
        const events = data.value!.results.map((event: EventResponse) => {
          return {
            id: event.id,
            name: event.name,
            tagline: event.tagline,
            createdBy: event.createdBy,
            iconUrl: event.iconUrl,
            type: event.type,

            onlineLocationLink: event.onlineLocationLink,
            offlineLocation: event.offlineLocation,

            getInvolvedUrl: event.getInvolvedUrl,
            socialLinks: event.socialLinks,
            faqEntries: event.faqEntries,
            startTime: event.startTime,
            endTime: event.endTime,
            creationDate: event.creationDate,
            orgs: event.orgs,

            texts: event.texts[0],
          };
        });

        this.events = events;
      }

      this.loading = false;
    },

    // MARK: Update Texts

    async updateTexts(event: Event, formData: EventUpdateTextFormData) {
      this.loading = true;

      const responseEventTexts = await $fetch(
        BASE_BACKEND_URL + `/events/event_texts/${event.texts.id}`,
        {
          method: "PUT",
          body: {
            primary: true,
            description: formData.description,
            getInvolved: formData.getInvolved,
            donate_prompt: "",
            orgId: event.id,
            iso: "en",
          },
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      if (responseEventTexts) {
        this.event.texts.description = formData.description;
        this.event.texts.getInvolved = formData.getInvolved;
        this.event.getInvolvedUrl = formData.getInvolvedUrl;

        this.loading = false;

        return true;
      }

      return false;
    },

    // MARK: Delete Links

    // ATTN: Currently we're deleting the social links and rewriting all of them.
    async deleteSocialLinks(event: Event) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseSocialLinks = useFetch(
        `${BASE_BACKEND_URL}/communities/event_social_links`,
        {
          method: "DELETE",
          body: JSON.stringify({
            link: "https://www.example.com",
            label: "placeholder",
            event: event.id,
          }),
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      const responseSocialLinksData = responseSocialLinks.data
        .value as unknown as Event;
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated org data after successful updates to update the frontend.
        await this.fetchById(event.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Create Links

    async createSocialLinks(event: Event, formData: SocialLinkFormData[]) {
      this.loading = true;
      const responses: boolean[] = [];

      // Note: Map of the request sends individual requests for each social link to  create the entry in the table.
      const responseSocialLinks = await Promise.all(
        formData.map((data) =>
          useFetch(`${BASE_BACKEND_URL}/communities/event_social_links`, {
            method: "POST",
            body: JSON.stringify({
              link: data.link,
              label: data.label,
              order: data.order,
              event: event.id,
            }),
            headers: {
              Authorization: `${token.value}`,
            },
          })
        )
      );

      const responseSocialLinksData = responseSocialLinks.map(
        (item) => item.data.value as unknown as Event
      );
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated org data after successful updates to update the frontend.
        await this.fetchById(event.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update Links

    async updateSocialLinks(event: Event, formData: SocialLinkFormData[]) {
      this.loading = true;
      const responses: boolean[] = [];

      // Note: Map of the request sends individual requests for each social link to the correct entry in the table.
      const responseSocialLinks = await Promise.all(
        formData.map((data) =>
          useFetch(
            `${BASE_BACKEND_URL}/communities/event_social_links/${data.id}`,
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
        (item) => item.data.value as unknown as Event
      );
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated event data after successful updates to update the frontend.
        await this.fetchById(event.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Create FAQ

    async createFaqEntry(event: Event, formData: FaqEntry) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/events/event_faqs`,
        {
          method: "POST",
          body: JSON.stringify({
            iso: formData.iso,
            order: formData.order,
            question: formData.question,
            answer: formData.answer,
            event: event.id,
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
        await this.fetchById(event.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update FAQ

    async updateFaqEntry(event: Event, formData: FaqEntry) {
      this.loading = true;
      const responses: boolean[] = [];

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/events/event_faqs/${formData.id}`,
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
        .value as unknown as Event;
      if (responseFaqEntriesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated event data after successful updates to update the frontend.
        await this.fetchById(event.id);
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
  },
});
