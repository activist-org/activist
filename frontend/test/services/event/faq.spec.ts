// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { FaqEntry } from "../../../shared/types/content/faq-entry";

import {
  createEventFaq,
  deleteEventFaq,
  reorderEventFaqs,
  updateEventFaq,
} from "../../../app/services/event/faq";
import { AppError } from "../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../helpers";

describe("services/event/faq", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: Create

  it("createEventFaq() posts JSON with event", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const faq: FaqEntry = {
      id: "f1",
      iso: "en",
      order: 0,
      question: "Q?",
      answer: "A",
    } as unknown as FaqEntry;
    await createEventFaq("evt-1", faq);

    expectJsonRequest(fetchMock, "/events/event_faqs", "POST", {
      iso: "en",
      order: 0,
      question: "Q?",
      answer: "A",
      event: "evt-1",
    });
  });

  // MARK: Update

  it("updateEventFaq() puts JSON with event", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const faq: FaqEntry = {
      id: "f2",
      iso: "en",
      order: 1,
      question: "Q2?",
      answer: "A2",
    } as unknown as FaqEntry;
    await updateEventFaq("evt-2", faq);

    expectJsonRequest(fetchMock, "/events/event_faqs/f2", "PUT", {
      id: "f2",
      question: "Q2?",
      answer: "A2",
      order: 1,
      event: "evt-2",
    });
  });

  // MARK: Reorder

  it("reorderEventFaqs() PUTs id/order/event for each", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const faqs: FaqEntry[] = [
      { id: "a", order: 1 } as unknown as FaqEntry,
      { id: "b", order: 2 } as unknown as FaqEntry,
    ];
    await reorderEventFaqs("evt-3", faqs);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [, opts] = getFetchCall(fetchMock, 0);
    expect(opts.method).toBe("PUT");
  });

  it("reorderEventFaqs() with empty list makes no calls", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    await reorderEventFaqs("evt-empty", []);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reorderEventFaqs() with single item makes one call", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const faqs: FaqEntry[] = [{ id: "only", order: 0 } as unknown as FaqEntry];
    await reorderEventFaqs("evt-one", faqs);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectJsonRequest(fetchMock, "/events/event_faqs/only", "PUT", {
      id: "only",
      order: 0,
      event: "evt-one",
    });
  });

  // MARK: Delete

  it("deleteEventFaq() calls DELETE endpoint", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await deleteEventFaq("faq-123");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(fetchMock, 0);
    expect(url).toContain("/events/event_faqs/faq-123");
    expect(opts.method).toBe("DELETE");
  });

  it("deleteEventFaq() handles successful deletion", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await expect(deleteEventFaq("faq-456")).resolves.toBeUndefined();
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createEventFaq("evt-err", { id: "x" } as unknown as FaqEntry)
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deleteEventFaq() propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("delete failed"));
    await expect(deleteEventFaq("faq-err")).rejects.toBeInstanceOf(AppError);
  });
});
