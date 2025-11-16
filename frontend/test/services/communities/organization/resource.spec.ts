// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { Resource, ResourceInput } from "#shared/types/content/resource";

import {
  createOrganizationResource,
  reorderOrganizationResources,
  updateOrganizationResource,
} from "~/services/communities/organization/resource";
import { AppError } from "#shared/utils/errorHandler";

import {
  expectJsonRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/organization/resource", () => {
  const getMocks = setupServiceTestMocks();

  it("createOrganizationResource() posts JSON to organization_resources", async () => {
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

    await createOrganizationResource("org-1", input);

    expectJsonRequest(
      fetchMock,
      "/communities/organization_resources",
      "POST",
      {
        ...input,
        org: "org-1",
      }
    );
  });

  // MARK: Update

  it("updateOrganizationResource() puts JSON to organization_resources/:id", async () => {
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

    await updateOrganizationResource("org-2", input);

    expectJsonRequest(
      fetchMock,
      "/communities/organization_resources/r2",
      "PUT",
      {
        ...input,
        org: "org-2",
      }
    );
  });

  it("reorderOrganizationResources() PUTs each resource with id/order/org", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const resources: Resource[] = [
      { id: "a", order: 1 } as unknown as Resource,
      { id: "b", order: 2 } as unknown as Resource,
    ];

    await reorderOrganizationResources("org-3", resources);

    // two calls, one per resource
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [firstUrl, firstOpts] = getFetchCall(fetchMock, 0);
    expect(firstUrl).toBe("/communities/organization_resources/a");
    expect(firstOpts.method).toBe("PUT");
    expect(firstOpts.headers?.["Content-Type"]).toBe("application/json");
    expect(firstOpts.body).toMatchObject({ id: "a", order: 1, org: "org-3" });

    const [secondUrl, secondOpts] = getFetchCall(fetchMock, 1);
    expect(secondUrl).toBe("/communities/organization_resources/b");
    expect(secondOpts.method).toBe("PUT");
    expect(secondOpts.headers?.["Content-Type"]).toBe("application/json");
    expect(secondOpts.body).toMatchObject({ id: "b", order: 2, org: "org-3" });
  });

  it("reorderOrganizationResources() with empty list makes no calls", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    await reorderOrganizationResources("org-empty", []);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reorderOrganizationResources() with single item makes one call", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const resources: Resource[] = [
      { id: "only", order: 0 } as unknown as Resource,
    ];
    await reorderOrganizationResources("org-one", resources);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectJsonRequest(
      fetchMock,
      "/communities/organization_resources/only",
      "PUT",
      {
        id: "only",
        order: 0,
        org: "org-one",
      }
    );
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createOrganizationResource("org-err", {
        id: "x",
      } as unknown as ResourceInput)
    ).rejects.toBeInstanceOf(AppError);
  });
});
