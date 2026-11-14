// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: List
export async function listOrganizationSupports(): Promise<Support[]> {
  try {
    const response = await get(`/communities/org_supports`);
    return response.data;
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
// MARK: Create

export async function createOrganizationSupport(
  orgId: string,
  supporterType: "user" | "org"
): Promise<Support> {
  try {
    return await post(
      `/communities/org_supports/${orgId}`,
      { supporterType },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteOrganizationSupport(orgId: string): Promise<void> {
  try {
    await del(`/communities/org_supports/${orgId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
