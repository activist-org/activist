import type {
  Event,
  EventText,
  PiniaResEvent,
  PiniaResEvents,
  PiniaResEventText,
  PiniaResEventTexts,
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
      iconUrl: "",
      type: "learn",
      onlineLocationLink: "",
      offlineLocation: "",
      offlineLocationLat: "",
      offlineLocationLong: "",
      getInvolvedUrl: "",
      socialLinks: [""],
      startTime: "",
      endTime: "",
      creationDate: "",

      organizations: [],

      eventTextId: "",
      description: "",
      getInvolved: "",
    },

    events: [],
  }),
  actions: {
    // MARK: Create

    async create() {},

    // MARK: Fetch By ID

    async fetchById(id: string | undefined) {
      this.loading = true;

      const [resEvent, resEventTexts] = await Promise.all([
        useAsyncData(
          async () => await fetchWithOptionalToken(`/events/events/${id}`, {})
        ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithOptionalToken(
        //       `/entities/event_faq?event_id=${id}`,
        //       {}
        //     )
        // ),
        // useAsyncData(
        //   async () =>
        //     await fetchWithOptionalToken(
        //       `/entities/event_resources?event_id=${id}`,
        //       {}
        //     )
        // ),
        useAsyncData(
          async () =>
            await fetchWithOptionalToken(
              `/events/event_texts?event_id=${id}`,
              {}
            )
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
      this.event.iconUrl = event.iconUrl;
      this.event.offlineLocation = event.offlineLocation;
      this.event.getInvolvedUrl = event.getInvolvedUrl;
      this.event.socialLinks = event.socialLinks;

      this.event.description = texts.description;
      this.event.getInvolved = texts.getInvolved;

      this.loading = false;
    },

    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const [responseEvents] = await Promise.all([
        useAsyncData(
          async () => await fetchWithOptionalToken(`/events/events/`, {})
        ),
      ]);

      const events = responseEvents.data as unknown as PiniaResEvents;

      if (events._value) {
        const responseEventTexts = (await Promise.all(
          events._value.map((event) =>
            useAsyncData(
              async () =>
                await fetchWithOptionalToken(
                  `/events/event_texts?event_id=${event.id}`,
                  {}
                )
            )
          )
        )) as unknown as PiniaResEventTexts[];

        const eventTextsData = responseEventTexts.map(
          (text) => text.data._value.results[0]
        ) as unknown as EventText[];

        const eventsWithTexts = events._value.map(
          (event: Event, index: number) => {
            const texts = eventTextsData[index];
            return {
              id: event.id,
              name: event.name,
              tagline: event.tagline,
              createdBy: event.createdBy,
              iconUrl: event.iconUrl,
              type: event.type,
              onlineLocationLink: event.onlineLocationLink,
              offlineLocation: event.offlineLocation,
              offlineLocationLat: event.offlineLocationLat,
              offlineLocationLong: event.offlineLocationLong,
              getInvolvedUrl: event.getInvolvedUrl,
              socialLinks: event.socialLinks,
              startTime: event.startTime,
              endTime: event.endTime,
              creationDate: event.creationDate,
              organizations: event.organizations,

              eventTextId: event.eventTextId,
              description: texts.description,
              getInvolved: texts.getInvolved,
            };
          }
        );

        this.events = eventsWithTexts;
      }

      this.loading = false;
    },

    // MARK: Update

    async update() {},

    // MARK: Delete

    async delete() {
      this.loading = true;

      this.loading = false;
    },
  },
});
