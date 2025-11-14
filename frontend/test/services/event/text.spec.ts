// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { updateEventTexts } from "~/services/event/text";
import { AppError } from "~/utils/errorHandler";

import { expectJsonRequest, setupServiceTestMocks } from "../helpers";

describe("services/event/text", () => {
  const getMocks = setupServiceTestMocks();

  it("updateEventTexts() PUTs to event_texts with JSON body", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await updateEventTexts("evt-1", "txt-1", {
      description: "d",
      getInvolved: "g",
      getInvolvedUrl: "u",
    } as unknown as Parameters<typeof updateEventTexts>[2]);

    expectJsonRequest(fetchMock, "/events/event_texts/txt-1", "PUT", {
      primary: true,
      description: "d",
      getInvolved: "g",
      getInvolvedUrl: "u",
      donate_prompt: "",
      orgId: "evt-1",
      iso: "en",
    });
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      updateEventTexts("evt-err", "txt-err", {
        description: "",
        getInvolved: "",
        getInvolvedUrl: undefined,
      } as unknown as Parameters<typeof updateEventTexts>[2])
    ).rejects.toBeInstanceOf(AppError);
  });
});
