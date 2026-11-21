// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: List
export async function listEventSupports(): Promise<Support[]> {
  try {
    const response = await get(`/events/event_supports`);
    return response.data;
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
// MARK: Create

export async function createEventUserSupport(
  eventId: string
): Promise<Support> {
  try {
    return await post(`/events/event_support_from_users/${eventId}`, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteEventUserSupport(eventId: string): Promise<void> {
  try {
    await del(`/events/event_support_from_users/${eventId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
