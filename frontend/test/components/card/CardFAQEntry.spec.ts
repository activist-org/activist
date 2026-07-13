// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FaqEntry } from "../../../shared/types/faq-entry";

import CardFAQEntry from "../../../app/components/card/CardFAQEntry.vue";
import { useModals } from "../../../app/stores/modals";
import { EntityType } from "../../../shared/types/entity";
import { createMockOrganization } from "../../mocks/factories";
import render from "../../render";

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

const faqEntry: FaqEntry = {
  id: "faq-1",
  iso: "en-US",
  order: 1,
  question: "What is activism?",
  answer: "Taking action for change.",
};

beforeEach(() => {
  mockPermissions.canEdit = true;
  mockPermissions.canDelete = true;
});

describe("CardFAQEntry", () => {
  it("renders the question", async () => {
    await render(CardFAQEntry, {
      props: { faqEntry, pageType: EntityType.EVENT },
    });

    expect(screen.getByTestId("faq-question").textContent).toContain(
      faqEntry.question
    );
  });

  it("reveals the answer when the disclosure button is clicked", async () => {
    await render(CardFAQEntry, {
      props: { faqEntry, pageType: EntityType.EVENT },
    });

    expect(screen.queryByTestId("faq-answer")).toBeNull();
    expect(screen.getByTestId("faq-chevron-down")).toBeTruthy();

    await fireEvent.click(screen.getByTestId("faq-disclosure-button"));

    expect(screen.getByTestId("faq-answer").textContent).toContain(
      faqEntry.answer
    );
    expect(screen.getByTestId("faq-chevron-up")).toBeTruthy();
    expect(screen.queryByTestId("faq-chevron-down")).toBeNull();
  });

  it("opens the edit-FAQ modal with the entry and entity id when the edit icon is clicked", async () => {
    const organization = createMockOrganization({ id: "org-1" });

    await render(CardFAQEntry, {
      props: {
        faqEntry,
        pageType: EntityType.ORGANIZATION,
        entity: organization,
      },
    });

    await fireEvent.click(screen.getByTestId("faq-edit-button"));

    const modals = useModals();
    expect(modals.modals["ModalFaqEntryOrganization"]?.isOpen).toBe(true);
    expect(modals.modals["ModalFaqEntryOrganization"]?.props).toEqual({
      faqEntry,
      entityId: "org-1",
    });
  });

  it("opens the delete-FAQ modal with the entity and entry ids when the delete icon is clicked", async () => {
    const organization = createMockOrganization({ id: "org-1" });

    await render(CardFAQEntry, {
      props: {
        faqEntry,
        pageType: EntityType.ORGANIZATION,
        entity: organization,
      },
    });

    await fireEvent.click(screen.getByTestId("faq-delete-button"));

    const modals = useModals();
    expect(modals.modals["ModalFaqEntryDeleteOrganization"]?.isOpen).toBe(
      true
    );
    expect(modals.modals["ModalFaqEntryDeleteOrganization"]?.props).toEqual({
      entityId: "org-1",
      faqEntryId: faqEntry.id,
    });
  });

  it("hides the edit, delete, and drag controls when the user lacks permission", async () => {
    mockPermissions.canEdit = false;
    mockPermissions.canDelete = false;

    await render(CardFAQEntry, {
      props: { faqEntry, pageType: EntityType.EVENT },
    });

    expect(screen.queryByTestId("faq-edit-button")).toBeNull();
    expect(screen.queryByTestId("faq-delete-button")).toBeNull();
    expect(screen.queryByTestId("faq-drag-handle")).toBeNull();
  });
});
