// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import type {
  Resource,
  ResourceInput,
} from "../../../app/types/content/resource";

import {
  createEventResource,
  updateEventResource,
  reorderEventResources,
} from "../../../app/services/event/resource";
import { AppError } from "../../../app/utils/errorHandler";
import {
  expectJsonRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../helpers";

describe("services/event/resource", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: - Create

  it("createEventResource() posts JSON with event", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const input: ResourceInput = {
      id: "r1",
      name: "R",
      url: "https://x",
      order: 0,
      description: "",
      creationDate: "2025-01-01",
    } as unknown as ResourceInput;
    await createEventResource("evt-1", input);
    expectJsonRequest(fetchMock, "/events/event_resources", "POST", {
      ...input,
      event: "evt-1",
    });
  });

  // MARK: - Update

  it("updateEventResource() puts JSON with event", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const input: ResourceInput = {
      id: "r2",
      name: "R2",
      url: "https://y",
      order: 1,
      description: "",
      creationDate: "2025-01-02",
    } as unknown as ResourceInput;
    await updateEventResource("evt-2", input);
    expectJsonRequest(fetchMock, "/events/event_resources/r2", "PUT", {
      ...input,
      event: "evt-2",
    });
  });

  // MARK: - Reorder

  it("reorderEventResources() PUTs id/order/event for each", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const resources: Resource[] = [
      { id: "a", order: 1 } as unknown as Resource,
      { id: "b", order: 2 } as unknown as Resource,
    ];
    await reorderEventResources("evt-3", resources);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [, opts] = getFetchCall(fetchMock, 0);
    expect(opts.method).toBe("PUT");
  });

  it("reorderEventResources() with empty list makes no calls", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    await reorderEventResources("evt-empty", []);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reorderEventResources() with single item makes one call", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const resources: Resource[] = [
      { id: "only", order: 0 } as unknown as Resource,
    ];
    await reorderEventResources("evt-one", resources);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectJsonRequest(fetchMock, "/events/event_resources/only", "PUT", {
      id: "only",
      order: 0,
      event: "evt-one",
    });
  });

  // MARK: - Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createEventResource("evt-err", { id: "x" } as unknown as ResourceInput)
    ).rejects.toBeInstanceOf(AppError);
  });
});
