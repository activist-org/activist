// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Create

export async function createOrganizationUserSupport(
  orgId: string
): Promise<Support> {
  try {
    return await post(`/communities/organization_support_from_users/${orgId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteOrganizationUserSupport(
  orgId: string
): Promise<void> {
  try {
    await del(`/communities/organization_support_from_users/${orgId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
