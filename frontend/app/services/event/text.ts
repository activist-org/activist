// SPDX-License-Identifier: AGPL-3.0-or-later

import type { EventUpdateTextFormData } from "~/types/events/event";

import { put, type AcceptedBody } from "~/services/http";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Update

export async function updateEventTexts(
  eventId: string,
  textId: string,
  data: EventUpdateTextFormData
): Promise<void> {
  try {
    await put(
      `/events/event_texts/${textId}`,
      {
        primary: true,
        description: data.description,
        getInvolved: data.getInvolved,
        getInvolvedUrl: data.getInvolvedUrl,
        donate_prompt: "",
        orgId: eventId,
        iso: "en",
      } as AcceptedBody,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
