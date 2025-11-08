// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import { updateOrganizationTexts } from "../../../../app/services/communities/organization/text";
import { AppError } from "../../../../app/utils/errorHandler";
import { expectJsonRequest, setupServiceTestMocks } from "../../helpers";

describe("services/communities/organization/text", () => {
  const getMocks = setupServiceTestMocks();

  it("updateOrganizationTexts() PUTs to organization_texts with JSON body", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });

    const payload = {
      description: "d",
      getInvolved: "g",
      getInvolvedUrl: "u",
    } as const;

    await updateOrganizationTexts(
      "org-1",
      "txt-1",
      payload as unknown as Parameters<typeof updateOrganizationTexts>[2]
    );

    expectJsonRequest(
      fetchMock,
      "/communities/organization_texts/txt-1",
      "PUT",
      {
        primary: true,
        description: payload.description,
        getInvolved: payload.getInvolved,
        getInvolvedUrl: payload.getInvolvedUrl,
        donate_prompt: "",
        orgId: "org-1",
        iso: "en",
      }
    );
  });

  // MARK: - Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      updateOrganizationTexts("org-err", "txt-err", {
        description: "",
        getInvolved: "",
        getInvolvedUrl: undefined,
      } as unknown as Parameters<typeof updateOrganizationTexts>[2])
    ).rejects.toBeInstanceOf(AppError);
  });
});
