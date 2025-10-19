// SPDX-License-Identifier: AGPL-3.0-or-later

import type { OrganizationUpdateTextFormData } from "~/types/communities/organization";

import { put, type AcceptedBody } from "~/services/http";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Update

export async function updateOrganizationTexts(
  orgId: string,
  textId: string,
  data: OrganizationUpdateTextFormData
): Promise<void> {
  try {
    await put(
      `/communities/organization_texts/${textId}`,
      {
        primary: true,
        description: data.description,
        getInvolved: data.getInvolved,
        donate_prompt: "",
        orgId: orgId,
        iso: "en",
      } as AcceptedBody,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    throw errorHandler(e);
  }
}
