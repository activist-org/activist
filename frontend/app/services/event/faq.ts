// SPDX-License-Identifier: AGPL-3.0-or-later

const faqEventBaseUrl = `${eventBaseUrl}/event_faqs`;

// MARK: Create

export async function createEventFaq(
  eventId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await post(
      faqEventBaseUrl,
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
      `${faqEventBaseUrl}/${faq.id}`,
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
          `${faqEventBaseUrl}/${f.id}`,
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

// MARK: Delete

export async function deleteEventFaq(faqId: string): Promise<void> {
  try {
    await del(`${faqEventBaseUrl}/${faqId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
