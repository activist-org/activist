// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { FaqEntry } from "../../../shared/types/faq-entry";

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
    const { post } = getMocks();
    post.mockResolvedValueOnce({ ok: true });
    const faq: FaqEntry = {
      id: "f1",
      iso: "en",
      order: 0,
      question: "Q?",
      answer: "A",
    } as unknown as FaqEntry;
    await createEventFaq("evt-1", faq);

    expectJsonRequest(post, "/events/event_faqs", "POST", {
      iso: "en",
      order: 0,
      question: "Q?",
      answer: "A",
      event: "evt-1",
    });
  });

  // MARK: Update

  it("updateEventFaq() puts JSON with event", async () => {
    const { put } = getMocks();
    put.mockResolvedValueOnce({ ok: true });
    const faq: FaqEntry = {
      id: "f2",
      iso: "en",
      order: 1,
      question: "Q2?",
      answer: "A2",
    } as unknown as FaqEntry;
    await updateEventFaq("evt-2", faq);

    expectJsonRequest(put, "/events/event_faqs/f2", "PUT", {
      id: "f2",
      question: "Q2?",
      answer: "A2",
      order: 1,
      event: "evt-2",
    });
  });

  // MARK: Reorder

  it("reorderEventFaqs() PUTs id/order/event for each", async () => {
    const { put } = getMocks();
    put.mockResolvedValue({ ok: true });
    const faqs: FaqEntry[] = [
      { id: "a", order: 1 } as unknown as FaqEntry,
      { id: "b", order: 2 } as unknown as FaqEntry,
    ];
    await reorderEventFaqs("evt-3", faqs);
    expect(put).toHaveBeenCalledTimes(2);
    const [, opts] = getFetchCall(put, 0);
    expect(opts.method).toBe("PUT");
  });

  it("reorderEventFaqs() with empty list makes no calls", async () => {
    const { put } = getMocks();
    put.mockResolvedValue({ ok: true });
    await reorderEventFaqs("evt-empty", []);
    expect(put).not.toHaveBeenCalled();
  });

  it("reorderEventFaqs() with single item makes one call", async () => {
    const { put } = getMocks();
    put.mockResolvedValue({ ok: true });
    const faqs: FaqEntry[] = [{ id: "only", order: 0 } as unknown as FaqEntry];
    await reorderEventFaqs("evt-one", faqs);
    expect(put).toHaveBeenCalledTimes(1);
    expectJsonRequest(put, "/events/event_faqs/only", "PUT", {
      id: "only",
      order: 0,
      event: "evt-one",
    });
  });

  // MARK: Delete

  it("deleteEventFaq() calls DELETE endpoint", async () => {
    const { del } = getMocks();
    del.mockResolvedValueOnce({ ok: true });
    await deleteEventFaq("faq-123");

    expect(del).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(del, 0);
    expect(url).toContain("/events/event_faqs/faq-123");
    expect(opts.method).toBe("DELETE");
  });

  it("deleteEventFaq() handles successful deletion", async () => {
    const { del } = getMocks();
    del.mockResolvedValueOnce({ ok: true });
    await expect(deleteEventFaq("faq-456")).resolves.toBeUndefined();
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { post } = getMocks();
    post.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createEventFaq("evt-err", { id: "x" } as unknown as FaqEntry)
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deleteEventFaq() propagates AppError on failure", async () => {
    const { del } = getMocks();
    del.mockRejectedValueOnce(new Error("delete failed"));
    await expect(deleteEventFaq("faq-err")).rejects.toBeInstanceOf(AppError);
  });
});
