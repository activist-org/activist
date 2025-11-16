// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { FaqEntry } from "../../../../shared/types/faq-entry";

import {
  createGroupFaq,
  deleteGroupFaq,
  reorderGroupFaqs,
  updateGroupFaq,
} from "../../../../app/services/communities/group/faq";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/group/faq", () => {
  const getMocks = setupServiceTestMocks();

  it("createGroupFaq() posts JSON with group", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const faq: FaqEntry = {
      id: "f1",
      iso: "en",
      order: 0,
      question: "Q?",
      answer: "A",
    } as unknown as FaqEntry;

    await createGroupFaq("grp-1", faq);

    expectJsonRequest(fetchMock, "/communities/group_faqs", "POST", {
      iso: "en",
      order: 0,
      question: "Q?",
      answer: "A",
      group: "grp-1",
    });
  });

  // MARK: Update

  it("updateGroupFaq() puts JSON to group_faqs/:id", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const faq: FaqEntry = {
      id: "f2",
      iso: "en",
      order: 1,
      question: "Q2?",
      answer: "A2",
    } as unknown as FaqEntry;

    await updateGroupFaq(faq);

    expectJsonRequest(fetchMock, "/communities/group_faqs/f2", "PUT", {
      id: "f2",
      question: "Q2?",
      answer: "A2",
    });
  });

  it("reorderGroupFaqs() PUTs each entry id/order", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const faqs: FaqEntry[] = [
      { id: "a", order: 1 } as unknown as FaqEntry,
      { id: "b", order: 2 } as unknown as FaqEntry,
    ];

    await reorderGroupFaqs(faqs);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [firstUrl, firstOpts] = getFetchCall(fetchMock, 0);
    expect(firstUrl).toBe("/communities/group_faqs/a");
    expect(firstOpts.method).toBe("PUT");
    const [secondUrl, secondOpts] = getFetchCall(fetchMock, 1);
    expect(secondUrl).toBe("/communities/group_faqs/b");
    expect(secondOpts.method).toBe("PUT");
  });

  // MARK: Delete

  it("deleteGroupFaq() calls DELETE endpoint", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await deleteGroupFaq("faq-123");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(fetchMock, 0);
    expect(url).toContain("/communities/group_faqs/faq-123");
    expect(opts.method).toBe("DELETE");
  });

  it("deleteGroupFaq() handles successful deletion", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await expect(deleteGroupFaq("faq-456")).resolves.toBeUndefined();
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createGroupFaq("grp-err", { id: "x" } as unknown as FaqEntry)
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deleteGroupFaq() propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("delete failed"));
    await expect(deleteGroupFaq("faq-err")).rejects.toBeInstanceOf(AppError);
  });
});
