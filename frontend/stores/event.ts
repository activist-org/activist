import type {
  Event,
  PiniaResEvent,
  PiniaResEventText,
} from "~/types/events/event";

export const useEventStore = defineStore("event", {
  // MARK: Properties

  state: (): Event => ({
    loading: false,

    // event
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
  }),
  actions: {
    async fetchByID(id: string | undefined) {
      // MARK: API Calls

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

      // MARK: Result Parsing

      const eventRes = resEvent.data as unknown as PiniaResEvent;
      // const eventFAQRes = resEventFAQ.data as unknown as PiniaResEvent;
      // const eventResourcesRes =
      //   resEventResources.data as unknown as PiniaResEvent;
      const eventTextsRes = resEventTexts.data as unknown as PiniaResEventText;

      const event = eventRes._value;
      // const faq = eventRes._value;
      // const resources = eventRes._value;
      const texts = eventTextsRes._value.results[0];

      // MARK: Assignment

      this.id = event.id;
      this.name = event.name;
      this.tagline = event.tagline;
      this.iconURL = event.iconURL;
      this.offlineLocation = event.offlineLocation;
      this.getInvolvedURL = event.getInvolvedURL;
      this.socialLinks = event.socialLinks;

      this.description = texts.description;
      this.getInvolved = texts.getInvolved;

      this.loading = false;
    },
  },
});
