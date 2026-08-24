// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { Resource, ResourceInput } from "../../../shared/types/resource";

import {
  createEventResource,
  reorderEventResources,
  updateEventResource,
} from "../../../app/services/event/resource";
import { AppError } from "../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../helpers";

describe("services/event/resource", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: Create

  it("createEventResource() posts JSON with event", async () => {
    const { post } = getMocks();
    post.mockResolvedValueOnce({ ok: true });
    const input: ResourceInput = {
      id: "r1",
      name: "R",
      url: "https://x",
      order: 0,
      description: "",
      creationDate: "2025-01-01",
    } as unknown as ResourceInput;
    await createEventResource("evt-1", input);
    expectJsonRequest(post, "/events/event_resources", "POST", {
      ...input,
      event: "evt-1",
    });
  });

  // MARK: Update

  it("updateEventResource() puts JSON with event", async () => {
    const { put } = getMocks();
    put.mockResolvedValueOnce({ ok: true });
    const input: ResourceInput = {
      id: "r2",
      name: "R2",
      url: "https://y",
      order: 1,
      description: "",
      creationDate: "2025-01-02",
    } as unknown as ResourceInput;
    await updateEventResource("evt-2", input);
    expectJsonRequest(put, "/events/event_resources/r2", "PUT", {
      ...input,
      event: "evt-2",
    });
  });

  // MARK: Reorder

  it("reorderEventResources() PUTs id/order/event for each", async () => {
    const { put } = getMocks();
    put.mockResolvedValue({ ok: true });
    const resources: Resource[] = [
      { id: "a", order: 1 } as unknown as Resource,
      { id: "b", order: 2 } as unknown as Resource,
    ];
    await reorderEventResources("evt-3", resources);
    expect(put).toHaveBeenCalledTimes(2);
    const [, opts] = getFetchCall(put, 0);
    expect(opts.method).toBe("PUT");
  });

  it("reorderEventResources() with empty list makes no calls", async () => {
    const { put } = getMocks();
    put.mockResolvedValue({ ok: true });
    await reorderEventResources("evt-empty", []);
    expect(put).not.toHaveBeenCalled();
  });

  it("reorderEventResources() with single item makes one call", async () => {
    const { put } = getMocks();
    put.mockResolvedValue({ ok: true });
    const resources: Resource[] = [
      { id: "only", order: 0 } as unknown as Resource,
    ];
    await reorderEventResources("evt-one", resources);
    expect(put).toHaveBeenCalledTimes(1);
    expectJsonRequest(put, "/events/event_resources/only", "PUT", {
      id: "only",
      order: 0,
      event: "evt-one",
    });
  });

  // MARK: Delete

  it("deleteEventResource() calls DELETE endpoint", async () => {
    const { del } = getMocks();
    del.mockResolvedValueOnce({ ok: true });
    await deleteEventResource("resource-123");

    expect(del).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(del, 0);
    expect(url).toContain("/events/event_resources/resource-123");
    expect(opts.method).toBe("DELETE");
  });

  it("deleteEventResource() handles successful deletion", async () => {
    const { del } = getMocks();
    del.mockResolvedValueOnce({ ok: true });
    await expect(deleteEventResource("resource-456")).resolves.toBeUndefined();
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { post } = getMocks();
    post.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createEventResource("evt-err", { id: "x" } as unknown as ResourceInput)
    ).rejects.toBeInstanceOf(AppError);
  });
});
