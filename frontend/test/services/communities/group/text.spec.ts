// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import { updateGroupTexts } from "../../../../app/services/communities/group/text";
import { AppError } from "../../../../app/utils/errorHandler";
import { expectJsonRequest, setupServiceTestMocks } from "../../helpers";

describe("services/communities/group/text", () => {
  const getMocks = setupServiceTestMocks();

  it("updateGroupTexts() PUTs to group_texts with JSON body", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });

    const payload = {
      description: "d",
      getInvolved: "g",
      getInvolvedUrl: "u",
    } as const;

    await updateGroupTexts(
      "grp-1",
      "txt-1",
      payload as unknown as Parameters<typeof updateGroupTexts>[2]
    );

    expectJsonRequest(fetchMock, "/communities/group_texts/txt-1", "PUT", {
      primary: true,
      description: payload.description,
      getInvolved: payload.getInvolved,
      getInvolvedUrl: payload.getInvolvedUrl,
      donate_prompt: "",
      groupId: "grp-1",
      iso: "en",
    });
  });

  // MARK: - Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      updateGroupTexts("grp-err", "txt-err", {
        description: "",
        getInvolved: "",
        getInvolvedUrl: undefined,
      } as unknown as Parameters<typeof updateGroupTexts>[2])
    ).rejects.toBeInstanceOf(AppError);
  });
});
