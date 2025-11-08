// SPDX-License-Identifier: AGPL-3.0-or-later

import type { FaqEntry } from "~/types/content/faq-entry";

import { post, put } from "~/services/http";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Create

export async function createEventFaq(
  eventId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await post(
      `/events/event_faqs`,
      {
        iso: faq.iso,
        order: faq.order,
        question: faq.question,
        answer: faq.answer,
        event: eventId,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

export async function updateEventFaq(
  eventId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await put(
      `/events/event_faqs/${faq.id}`,
      {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        event: eventId,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder

export async function reorderEventFaqs(
  eventId: string,
  faqs: FaqEntry[]
): Promise<void> {
  try {
    await Promise.all(
      faqs.map((f) =>
        put(
          `/events/event_faqs/${f.id}`,
          {
            id: f.id,
            order: f.order,
            event: eventId,
          },
          { headers: { "Content-Type": "application/json" } }
        )
      )
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
