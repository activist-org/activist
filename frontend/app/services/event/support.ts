// SPDX-License-Identifier: AGPL-3.0-or-later
import { del, post } from "~/services/http";

// MARK: Support Event

export async function supportEvent(eventId: string): Promise<void> {
  await post(`/events/events/${eventId}/support`, {});
}

// MARK: Unsupport Event

export async function unsupportEvent(eventId: string): Promise<void> {
  await del(`/events/events/${eventId}/support`);
}