// SPDX-License-Identifier: AGPL-3.0-or-later
import { del, post, put } from "~/services/http";

// MARK: Create

/**
 * Creates a new FAQ entry for a specific event by sending a POST request to the backend API with the provided FAQ data, including the question, answer, order, and associated event ID. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the FAQ entry is being created.
 * @param faq The FAQ entry data, including the question, answer, order, and ISO code.
 * @returns A Promise that resolves when the FAQ entry has been successfully created in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the creation process.
 */
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

/**
 * Updates an existing FAQ entry for a specific event by sending a PUT request to the backend API with the updated FAQ data, including the question, answer, order, and associated event ID. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the FAQ entry is being updated.
 * @param faq The updated FAQ entry data, including the question, answer, order, and ISO code.
 * @returns A Promise that resolves when the FAQ entry has been successfully updated in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
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

/**
 * Reorders the FAQ entries for a specific event by sending multiple PUT requests to the backend API with the updated order for each FAQ entry. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the FAQ entries are being reordered.
 * @param faqs An array of FAQ entries with their updated order.
 * @returns A Promise that resolves when all FAQ entries have been successfully reordered in the backend.
 * @throws {AppError} if any of the API requests fail or if there is an error during the reordering process.
 */
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

// MARK: Delete

/**
 * Deletes an FAQ entry for a specific event by sending a DELETE request to the backend API. The function uses the del helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param faqId The unique identifier of the FAQ entry to be deleted.
 * @returns A Promise that resolves when the FAQ entry has been successfully deleted in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteEventFaq(faqId: string): Promise<void> {
  try {
    await del(`/events/event_faqs/${faqId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
