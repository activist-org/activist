import type {
  Event,
  PiniaResEvent,
  PiniaResEventText,
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
      iconURL: "",
      type: "learn",
      offlineLocation: "",
      getInvolvedURL: "",
      socialLinks: [""],
      startTime: "",

      // event_organizations
      organizations: [],

      // event_text
      description: "",
      getInvolved: "",
    },
    events: [],
  }),
  actions: {
    // MARK: Create

    async create() {},

    // MARK: Fetch By ID

    async fetchByID(id: string | undefined) {
      this.loading = true;

      const [resEvent, resEventTexts] = await Promise.all([
        useAsyncData(
          async () => await fetchWithToken(`/entities/events/${id}`, {})
        ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithToken(
        //       `/entities/event_faq?event_id=${id}`,
        //       {}
        //     )
        // ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithToken(
        //       `/entities/event_resources?event_id=${id}`,
        //       {}
        //     )
        // ),
        useAsyncData(
          async () =>
            await fetchWithToken(`/entities/event_texts?event_id=${id}`, {})
        ),
      ]);

      const eventRes = resEvent.data as unknown as PiniaResEvent;
      // const eventFAQRes = resEventFAQ.data as unknown as PiniaResEvent;
      // const eventResourcesRes =
      //   resEventResources.data as unknown as PiniaResEvent;
      const eventTextsRes = resEventTexts.data as unknown as PiniaResEventText;

      const event = eventRes._value;
      // const faq = eventRes._value;
      // const resources = eventRes._value;
      const texts = eventTextsRes._value.results[0];

      this.event.id = event.id;
      this.event.name = event.name;
      this.event.tagline = event.tagline;
      this.event.iconURL = event.iconURL;
      this.event.offlineLocation = event.offlineLocation;
      this.event.getInvolvedURL = event.getInvolvedURL;
      this.event.socialLinks = event.socialLinks;

      this.event.description = texts.description;
      this.event.getInvolved = texts.getInvolved;

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {},

    // MARK: Update

    async update() {},

    // MARK: Delete

    async delete() {},
  },
});
