// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type {
  Resource,
  ResourceInput,
} from "../../../../shared/types/resource";

import {
  createGroupResource,
  reorderGroupResources,
  updateGroupResource,
} from "../../../../app/services/communities/group/resource";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/group/resource", () => {
  const getMocks = setupServiceTestMocks();

  it("createGroupResource() posts JSON to group_resources", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const input: ResourceInput = {
      id: "r1",
      name: "Res",
      url: "https://x",
      order: 0,
      description: "",
      creationDate: "2025-01-01",
    } as unknown as ResourceInput;

    await createGroupResource("grp-1", input);

    expectJsonRequest(fetchMock, "/communities/group_resources", "POST", {
      ...input,
      group: "grp-1",
    });
  });

  // MARK: Update

  it("updateGroupResource() puts JSON to group_resources/:id", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    const input: ResourceInput = {
      id: "r2",
      name: "Res2",
      url: "https://y",
      order: 1,
      description: "",
      creationDate: "2025-01-02",
    } as unknown as ResourceInput;

    await updateGroupResource(input);

    expectJsonRequest(fetchMock, "/communities/group_resources/r2", "PUT", {
      ...input,
    });
  });

  it("reorderGroupResources() PUTs each resource with id/order", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const resources: Resource[] = [
      { id: "a", order: 1 } as unknown as Resource,
      { id: "b", order: 2 } as unknown as Resource,
    ];

    await reorderGroupResources(resources);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [firstUrl, firstOpts] = getFetchCall(fetchMock, 0);
    expect(firstUrl).toBe("/communities/group_resources/a");
    expect(firstOpts.method).toBe("PUT");
    expect(firstOpts.headers?.["Content-Type"]).toBe("application/json");
    expect(firstOpts.body).toMatchObject({ id: "a", order: 1 });

    const [secondUrl, secondOpts] = getFetchCall(fetchMock, 1);
    expect(secondUrl).toBe("/communities/group_resources/b");
    expect(secondOpts.method).toBe("PUT");
    expect(secondOpts.headers?.["Content-Type"]).toBe("application/json");
    expect(secondOpts.body).toMatchObject({ id: "b", order: 2 });
  });

  it("reorderGroupResources() with empty list makes no calls", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    await reorderGroupResources([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reorderGroupResources() with single item makes one call", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const resources: Resource[] = [
      { id: "only", order: 0 } as unknown as Resource,
    ];
    await reorderGroupResources(resources);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectJsonRequest(fetchMock, "/communities/group_resources/only", "PUT", {
      id: "only",
      order: 0,
    });
  });

  // MARK: Delete

  it("deleteGroupResource() calls DELETE endpoint", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await deleteGroupResource("resource-123");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(fetchMock, 0);
    expect(url).toContain("/communities/group_resources/resource-123");
    expect(opts.method).toBe("DELETE");
  });

  it("deleteGroupResource() handles successful deletion", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await expect(deleteGroupResource("resource-456")).resolves.toBeUndefined();
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createGroupResource("grp-err", { id: "x" } as unknown as ResourceInput)
    ).rejects.toBeInstanceOf(AppError);
  });
});
