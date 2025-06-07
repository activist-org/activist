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

      const token = localStorage.getItem("accessToken");

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
            Authorization: `Token ${token}`,
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
          (await fetchWithoutToken(
            `/events/events/${id}/`,
            {}
          )) as EventResponse
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
          (await fetchWithoutToken(`/events/events/`, {})) as EventsResponseBody
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

      const token = localStorage.getItem("accessToken");

      const responseEvent = await $fetch(
        BASE_BACKEND_URL + `/events/events/${event.id}`,
        {
          method: "PUT",
          body: {
            ...event,
            getInvolvedUrl: formData.getInvolvedUrl,
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

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
            Authorization: `Token ${token}`,
          },
        }
      );

      if (responseEvent && responseEventTexts) {
        this.event.texts.description = formData.description;
        this.event.texts.getInvolved = formData.getInvolved;
        this.event.getInvolvedUrl = formData.getInvolvedUrl;

        this.loading = false;

        return true;
      }

      return false;
    },

    // MARK: Update Social Links

    async updateSocialLinks(event: Event, formData: SocialLinkFormData[]) {
      this.loading = true;
      const responses: boolean[] = [];

      const token = localStorage.getItem("accessToken");

      // Endpoint needs socialLink id's but they are not available here.
      // 'update()' in the viewset 'class EventSocialLinkViewSet' handles this
      // by using the event.id from the end of the URL.
      const responseSocialLinks = await useFetch(
        `${BASE_BACKEND_URL}/events/event_social_links/${event.id}`,
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
        .value as unknown as Event;
      if (responseSocialLinksData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        // Fetch updated event data after successful updates, to update the frontend.
        await this.fetchById(event.id);
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },

    // MARK: Update FAQ Entries

    async updateFaqEntry(event: Event, formData: FaqEntry) {
      this.loading = true;
      const responses: boolean[] = [];

      const token = localStorage.getItem("accessToken");

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/events/event_faqs/${event.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: formData.id,
            question: formData.question,
            answer: formData.answer,
          }),
          headers: {
            Authorization: `Token ${token}`,
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
        // Fetch updated event data after successful updates, to update the frontend.
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
