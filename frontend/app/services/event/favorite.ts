// SPDX-License-Identifier: AGPL-3.0-or-later
import { del, post } from "~/services/event/../http";

// MARK: Favorite Event

export async function favoriteEvent(eventId: string): Promise<void> {
  await post(`/events/events/${eventId}/favorite`, {});
}

// MARK: Unfavorite Event

export async function unfavoriteEvent(eventId: string): Promise<void> {
  await del(`/events/events/${eventId}/favorite`);
}