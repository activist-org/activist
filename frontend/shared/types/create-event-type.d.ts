// SPDX-License-Identifier: AGPL-3.0-or-later
export interface ContextCreateEventData {
  [CreateEventSteps.EventDetails]: {
    tagline: string;
    name: string;
    description: string;
  };
  [CreateEventSteps.EventType]: {
    type: EventType;
    setting: "online" | "offline";
  };
  [CreateEventSteps.Time]: {
    dates: {
      startDate: string;
      endDate: string;
    };
    createAnother: boolean;
  };
}
