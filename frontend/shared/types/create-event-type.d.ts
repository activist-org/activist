// SPDX-License-Identifier: AGPL-3.0-or-later
export interface ContextCreateEventData {
  [CreateEventSteps.EventDetails]: {
    tagline: string;
    name: string;
    description: string;
  };
  [CreateEventSteps.EventType]: {
    type: EventType;
    location_type: "online" | "physical";
  };
  [CreateEventSteps.Time]: {
    dates: {
      startDate: string;
      endDate: string;
    };
    createAnother: boolean;
  };
}
