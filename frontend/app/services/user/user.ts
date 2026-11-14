// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Map API Response to Type

export function mapUser(res: UserResponse): UserResponse {
  return {
    id: res.id,
    username: res.username,
    supportedEvents: res.supportedEvents ?? [],
    supportedOrganizations: res.supportedOrganizations ?? [],
  };
}

// MARK: Get by ID

export async function getUser(id: string): Promise<UserResponse> {
  try {
    const res = await get<UserResponse>(`/auth/users/${id}`);
    return mapUser(res);
  } catch (e) {
    throw errorHandler(e);
  }
}
