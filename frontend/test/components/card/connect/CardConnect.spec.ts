// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CardConnect from "../../../../app/components/card/connect/CardConnect.vue";
import { useModals } from "../../../../app/stores/modals";
import { getEnglishText } from "../../../../shared/utils/i18n";
import { createMockOrganization, createMockSocialLink } from "../../../mocks/factories";
import render from "../../../render";

const mockUserIsSignedIn = vi.hoisted(() => ({ value: true }));

mockNuxtImport("useUser", () => () => ({
  userIsSignedIn: mockUserIsSignedIn.value,
  userIsAdmin: false,
  roles: [],
  signOutUser: () => {},
  canDelete: () => false,
  canCreate: () => false,
  canView: () => true,
  canEdit: () => true,
  user: null,
}));

beforeEach(() => {
  mockUserIsSignedIn.value = true;
});

describe("CardConnect", () => {
  it("renders the header", async () => {
    await render(CardConnect, {
      props: { socialLinks: [], pageType: "organization" },
    });

    expect(
      screen.getByText(getEnglishText("i18n.components._global.connect"))
    ).toBeTruthy();
  });

  it("renders a social link per entry with its label", async () => {
    const socialLinks = [
      createMockSocialLink({ link: "https://example.com", label: "Website" }),
      createMockSocialLink({
        link: "https://mastodon.social/@activist",
        label: "Mastodon",
      }),
    ];

    const { container } = await render(CardConnect, {
      props: { socialLinks, pageType: "organization" },
    });

    const links = container.querySelectorAll("[data-testid='social-link']");
    expect(links.length).toBe(2);
    expect(screen.getByText("Website")).toBeTruthy();
    expect(screen.getByText("Mastodon")).toBeTruthy();
  });

  it("shows the edit icon when signed in and opens the social-links modal with the entity id", async () => {
    const organization = createMockOrganization({ id: "org-1" });

    await render(CardConnect, {
      props: {
        socialLinks: [],
        pageType: "organization",
        entity: organization,
      },
    });

    const editIcon = screen.getByTestId("icon-edit");
    expect(editIcon).toBeTruthy();

    await fireEvent.click(editIcon);

    const modals = useModals();
    expect(modals.modals["ModalSocialLinksOrganization"]?.isOpen).toBe(true);
    expect(modals.modals["ModalSocialLinksOrganization"]?.props).toEqual({
      entityId: "org-1",
    });
  });

  it("hides the edit icon when not signed in", async () => {
    mockUserIsSignedIn.value = false;

    await render(CardConnect, {
      props: { socialLinks: [], pageType: "organization" },
    });

    expect(screen.queryByTestId("icon-edit")).toBeNull();
  });
});
