// SPDX-License-Identifier: AGPL-3.0-or-later

import type { GroupUpdateTextFormData } from "~/types/communities/group";
import type { AcceptedBody } from "~/types/http";

import { put } from "~/services/http";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Update

export async function updateGroupTexts(
  groupId: string,
  textId: string,
  data: GroupUpdateTextFormData
): Promise<void> {
  try {
    await put(
      `/communities/group_texts/${textId}`,
      {
        primary: true,
        description: data.description,
        getInvolved: data.getInvolved,
        getInvolvedUrl: data.getInvolvedUrl,
        donate_prompt: "",
        groupId: groupId,
        iso: "en",
      } as AcceptedBody,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
