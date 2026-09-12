// SPDX-License-Identifier: AGPL-3.0-or-later
// Events service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import { del, get, getRaw, post } from "~/services/http";
import type { UserResponse } from "~~/shared/types/user";

// MARK: Map API Response to Type

export function mapUser(res: UserResponse): UserResponse {
  return {
    id: res.id,
    username: res.username,
    supportedEvents: res.supportedEvents ?? [],
  };
}

// MARK: Get by ID

export async function getUser(id: string): Promise<UserResponse> {
  try {
    const res = await get<UserResponse>(`/auth/users/${id}`);
    console.log(res);
    return mapUser(res);
  } catch (e) {
    throw errorHandler(e);
  }
}
