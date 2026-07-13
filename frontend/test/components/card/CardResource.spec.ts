// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardResource from "../../../app/components/card/CardResource.vue";
import { useModals } from "../../../app/stores/modals";
import { EntityType } from "../../../shared/types/entity";
import { createMockOrganization, createResource } from "../../mocks/factories";
import render from "../../render";

const stubs = {
  NuxtLink: {
    props: ["to"],
    template: '<a :href="to"><slot /></a>',
  },
  MenuSearchResult: { template: '<div data-testid="menu-search-result" />' },
  MetaTagOrganization: {
    props: ["organization"],
    template: '<div data-testid="meta-tag-organization" />',
  },
};

const mockPermissions = vi.hoisted(() => ({
  canEdit: true,
  canDelete: true,
}));

mockNuxtImport("useUser", () => () => ({
  userIsSignedIn: true,
  userIsAdmin: false,
  roles: [],
  signOutUser: () => {},
  canDelete: () => mockPermissions.canDelete,
  canCreate: () => false,
  canView: () => true,
  canEdit: () => mockPermissions.canEdit,
  user: null,
}));

vi.stubGlobal("useLocalePath", () => (path: string) => `/en${path}`);

beforeEach(() => {
  mockPermissions.canEdit = true;
  mockPermissions.canDelete = true;
});

describe("CardResource", () => {
  it("renders the resource name and description", async () => {
    const resource = createResource({
      name: "Community Toolkit",
      description: "A guide for organizers.",
    });
    const entity = createMockOrganization({ id: "org-1" });

    await render(CardResource, {
      props: { resource, entityType: EntityType.ORGANIZATION, entity },
      global: { stubs },
    });

    expect(screen.getByText("Community Toolkit")).toBeTruthy();
    expect(screen.getByText("A guide for organizers.")).toBeTruthy();
  });

  it("renders the resource link with the localized url", async () => {
    const resource = createResource({ url: "https://example.com/resource" });
    const entity = createMockOrganization({ id: "org-1" });

    const { container } = await render(CardResource, {
      props: { resource, entityType: EntityType.ORGANIZATION, entity },
      global: { stubs },
    });

    const link = container.querySelector(
      "a[href='/enhttps://example.com/resource']"
    );
    expect(link).toBeTruthy();
  });

  it("renders the organization meta tag when the resource has an org and is not reduced", async () => {
    const resource = createResource({ org: createMockOrganization() });
    const entity = createMockOrganization({ id: "org-1" });

    await render(CardResource, {
      props: {
        resource,
        entityType: EntityType.ORGANIZATION,
        entity,
        isReduced: false,
      },
      global: { stubs },
    });

    expect(screen.getByTestId("meta-tag-organization")).toBeTruthy();
  });

  it("hides the organization meta tag when reduced", async () => {
    const resource = createResource({ org: createMockOrganization() });
    const entity = createMockOrganization({ id: "org-1" });

    await render(CardResource, {
      props: {
        resource,
        entityType: EntityType.ORGANIZATION,
        entity,
        isReduced: true,
      },
      global: { stubs },
    });

    expect(screen.queryByTestId("meta-tag-organization")).toBeNull();
  });

  it("shows the drag handle, edit, and delete controls when permitted", async () => {
    const resource = createResource();
    const entity = createMockOrganization({ id: "org-1" });

    await render(CardResource, {
      props: { resource, entityType: EntityType.ORGANIZATION, entity },
      global: { stubs },
    });

    expect(screen.getByTestId("resource-drag-handle")).toBeTruthy();
    expect(screen.getByTestId("icon-edit")).toBeTruthy();
    expect(screen.getByTestId("icon-delete")).toBeTruthy();
  });

  it("hides the edit and delete controls when not permitted", async () => {
    mockPermissions.canEdit = false;
    mockPermissions.canDelete = false;
    const resource = createResource();
    const entity = createMockOrganization({ id: "org-1" });

    await render(CardResource, {
      props: { resource, entityType: EntityType.ORGANIZATION, entity },
      global: { stubs },
    });

    expect(screen.queryByTestId("icon-edit")).toBeNull();
    expect(screen.queryByTestId("icon-delete")).toBeNull();
  });

  it("opens the edit-resource modal with the resource and entity id when the edit icon is clicked", async () => {
    const resource = createResource({ id: "resource-1" });
    const entity = createMockOrganization({ id: "org-1" });

    await render(CardResource, {
      props: { resource, entityType: EntityType.ORGANIZATION, entity },
      global: { stubs },
    });

    await fireEvent.click(screen.getByTestId("icon-edit"));

    const modals = useModals();
    expect(modals.modals["ModalResourceOrganization"]?.isOpen).toBe(true);
    expect(modals.modals["ModalResourceOrganization"]?.props).toEqual({
      resource,
      entityId: "org-1",
    });
  });

  it("opens the delete-resource modal with the resource and entity ids when the delete icon is clicked", async () => {
    const resource = createResource({ id: "resource-1" });
    const entity = createMockOrganization({ id: "org-1" });

    await render(CardResource, {
      props: { resource, entityType: EntityType.ORGANIZATION, entity },
      global: { stubs },
    });

    await fireEvent.click(screen.getByTestId("icon-delete"));

    const modals = useModals();
    expect(
      modals.modals["ModalResourceDeleteOrganization"]?.isOpen
    ).toBe(true);
    expect(modals.modals["ModalResourceDeleteOrganization"]?.props).toEqual({
      resourceId: "resource-1",
      entityId: "org-1",
    });
  });
});
