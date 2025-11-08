// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import type { FaqEntry } from "../../../../app/types/content/faq-entry";

import {
  createOrganizationFaq,
  updateOrganizationFaq,
  reorderOrganizationFaqs,
} from "../../../../app/services/communities/organization/faq";
import { AppError } from "../../../../app/utils/errorHandler";
import {
  expectJsonRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/organization/faq", () => {
  const getMocks = setupServiceTestMocks();

  it("createOrganizationFaq() posts JSON with org", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const faq: FaqEntry = {
      id: "f1",
      iso: "en",
      order: 0,
      question: "Q?",
      answer: "A",
    } as unknown as FaqEntry;

    await createOrganizationFaq("org-1", faq);

    expectJsonRequest(fetchMock, "/communities/organization_faqs", "POST", {
      iso: "en",
      order: 0,
      question: "Q?",
      answer: "A",
      org: "org-1",
    });
  });

  // MARK: - Update

  it("updateOrganizationFaq() puts JSON to organization_faqs/:id", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const faq: FaqEntry = {
      id: "f2",
      iso: "en",
      order: 1,
      question: "Q2?",
      answer: "A2",
    } as unknown as FaqEntry;

    await updateOrganizationFaq(faq);

    expectJsonRequest(fetchMock, "/communities/organization_faqs/f2", "PUT", {
      id: "f2",
      question: "Q2?",
      answer: "A2",
    });
  });

  it("reorderOrganizationFaqs() PUTs each entry id/order", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const faqs: FaqEntry[] = [
      { id: "a", order: 1 } as unknown as FaqEntry,
      { id: "b", order: 2 } as unknown as FaqEntry,
    ];

    await reorderOrganizationFaqs(faqs);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [firstUrl, firstOpts] = getFetchCall(fetchMock, 0);
    expect(firstUrl).toBe("/communities/organization_faqs/a");
    expect(firstOpts.method).toBe("PUT");
    const [secondUrl, secondOpts] = getFetchCall(fetchMock, 1);
    expect(secondUrl).toBe("/communities/organization_faqs/b");
    expect(secondOpts.method).toBe("PUT");
  });

  // MARK: - Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createOrganizationFaq("org-err", { id: "x" } as unknown as FaqEntry)
    ).rejects.toBeInstanceOf(AppError);
  });
});
