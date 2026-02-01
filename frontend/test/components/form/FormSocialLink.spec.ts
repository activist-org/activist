// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SocialLinkFormData } from "../../../app/constants/social-link";

import FormSocialLink from "../../../app/components/form/FormSocialLink.vue";
import render from "../../render";
import { createUseUserSessionMock } from "../../mocks/composableMocks";

/**
 * This suite focuses on:
 *  - Logic:
 *      - Text validation via zod schema (required label, valid URL)
 *      - Change events propagating through FormItem/FormTextInput
 *      - Dynamic props (formData, submitLabel, title)
 *  - Style:
 *      - Tailwind layout classes from frontend/app/assets/css/tailwind.css
 *      - Error border color via "border-action-red"
 *  - Accessibility:
 *      - Draggable rows marked via data-draggable="true"
 *      - Presence of textbox roles and submit button
 *  - Edge cases:
 *      - Empty socialLinks array
 *      - Invalid values (empty label, non-URL link)
 */

// Helper to build a minimal valid social link entry.
const createSocialLink = (overrides: Partial<SocialLinkFormData> = {}) => ({
  id: overrides.id ?? "id-1",
  label: overrides.label ?? "My site",
  link: overrides.link ?? "https://example.com",
  order: overrides.order ?? 0,
});

describe("FormSocialLink", () => {
  // Set up useUserSession mock (required by IconDraggableEdit child component).
  beforeEach(() => {
    globalThis.useUserSession = createUseUserSessionMock();
  });
  // MARK: Logic Testing

  it("renders title, initial social links and add-link button", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    const formData = {
      socialLinks: [
        createSocialLink({
          id: "link-1",
          label: "activist",
          link: "https://activist.org/example",
          order: 0,
        }),
      ],
    };

    await render(FormSocialLink, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_social_link._global.save",
        title: "i18n.components.form_social_link._global.edit_links",
      },
    });

    // Title from `title` prop (raw i18n key in test env).
    const heading = screen.getByText(
      "i18n.components.form_social_link._global.edit_links"
    );
    expect(heading.tagName).toBe("H2");

    // Initial label + URL inputs populated from formData.
    const labelInput = screen.getByTestId(
      "social-link-label-0"
    ) as HTMLInputElement;
    const urlInput = screen.getByTestId(
      "social-link-url-0"
    ) as HTMLInputElement;

    expect(labelInput.value).toBe("activist");
    expect(urlInput.value).toBe("https://activist.org/example");

    // Add-link CTA button from BtnAction (accessible name comes from aria-label).
    const addButton = screen.getByRole("button", {
      name: /add a new social link/i,
    });
    expect(addButton).toBeTruthy();
  });

  it("validates invalid URL and prevents submit when data is invalid", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    // Start with invalid data: empty label  or  invalid URL.
    const formData = {
      socialLinks: [
        createSocialLink({
          label: "",
          link: "not-a-url",
          order: 0,
        }),
      ],
    };

    await render(FormSocialLink, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_social_link._global.save",
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });

    await fireEvent.click(submitButton);

    // Under invalid data, handleSubmit should NOT be called.
    await waitFor(() => {
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    // URL validation error from zod schema / translations.
    const urlError = await screen.findByTestId(
      "form-item-socialLinks.0.link-error"
    );
    expect(urlError.textContent || "").toMatch(/valid url/i);

    // Style coverage: invalid URL field should get error border color.
    const urlBorder = screen.getByTestId(
      "form-item-socialLinks.0.link-border"
    ) as HTMLElement;

    await waitFor(() => {
      expect(urlBorder.className).toContain("border-action-red");
    });
  });

  it("submits valid social link data", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    const formData = {
      socialLinks: [
        createSocialLink({
          id: "link-1",
          label: "",
          link: "",
          order: 0,
        }),
      ],
    };

    await render(FormSocialLink, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_social_link._global.save",
      },
    });

    const labelInput = screen.getByTestId(
      "social-link-label-0"
    ) as HTMLInputElement;
    const urlInput = screen.getByTestId(
      "social-link-url-0"
    ) as HTMLInputElement;

    // Simulate user filling in valid values.
    await fireEvent.update(labelInput, "Homepage");
    await fireEvent.update(urlInput, "https://example.org");

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    const firstCallArg = handleSubmit.mock.calls[0][0] as {
      socialLinks: Array<{ label: string; link: string }>;
    };

    expect(firstCallArg.socialLinks).toHaveLength(1);
    expect(firstCallArg.socialLinks[0].label).toBe("Homepage");
    expect(firstCallArg.socialLinks[0].link).toBe("https://example.org");
  });

  it("adds a new social link entry when the add-link button is clicked", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    const formData = {
      socialLinks: [createSocialLink({ label: "Existing", order: 0 })],
    };

    await render(FormSocialLink, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_social_link._global.save",
      },
    });

    let labelInputs = screen.getAllByTestId(/social-link-label-/);
    expect(labelInputs.length).toBe(1);

    const addButton = screen.getByRole("button", {
      name: /add a new social link/i,
    });
    await fireEvent.click(addButton);

    // After pushing a new link, there should be two rows.
    await waitFor(() => {
      labelInputs = screen.getAllByTestId(/social-link-label-/);
      expect(labelInputs.length).toBe(2);
    });
  });

  /**
   * We do not test the delete icon click directly here, because IconDelete does
   * not expose a DOM-level data-testid or role that we can reliably select.
   * Its behavior is assumed to be covered in its own unit tests. The integration
   * of socialLinks list length is instead covered in the "adds a new social link"
   * and empty-state tests.
   */

  // MARK: Style Testing

  it("uses flex layout classes on list containers and entries", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    const formData = {
      socialLinks: [createSocialLink({ label: "Styled link", order: 0 })],
    };

    await render(FormSocialLink, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_social_link._global.save",
        title: "i18n.components.form_social_link._global.edit_links",
      },
    });

    // The inner "Social links" heading is wrapped in a flex/column container.
    const heading = screen.getByRole("heading", {
      level: 2,
      name: /social links/i,
    });
    const wrapper = heading.closest("div");
    expect(wrapper).toBeTruthy();
    if (wrapper) {
      const { className } = wrapper;
      expect(className).toContain("flex");
      expect(className).toContain("flex-col");
      expect(className).toContain("space-y-3");
    }

    // Each list entry uses `flex items-center space-x-5`.
    const entry = screen.getByTestId("social-link-entry-0") as HTMLElement;
    expect(entry.className).toContain("flex");
    expect(entry.className).toContain("items-center");
    expect(entry.className).toContain("space-x-5");
  });

  // MARK: Accessibility Testing

  it("marks list entries as draggable via data-draggable attribute", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    const formData = {
      socialLinks: [createSocialLink()],
    };

    await render(FormSocialLink, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_social_link._global.save",
      },
    });

    const entry = screen.getByTestId("social-link-entry-0");
    expect(entry.getAttribute("data-draggable")).toBe("true");
  });

  // MARK: Edge Cases

  it("renders safely when socialLinks is empty and allows adding the first entry", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    const formData = {
      socialLinks: [],
    };

    await render(FormSocialLink, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_social_link._global.save",
      },
    });

    // No rows initially.
    let labelInputs = screen.queryAllByTestId(/social-link-label-/);
    expect(labelInputs.length).toBe(0);

    const addButton = screen.getByRole("button", {
      name: /add a new social link/i,
    });
    await fireEvent.click(addButton);

    await waitFor(() => {
      labelInputs = screen.getAllByTestId(/social-link-label-/);
      expect(labelInputs.length).toBe(1);
    });
  });

  it("handles absence of title prop while still rendering the built-in Social links heading", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    const formData = {
      socialLinks: [createSocialLink()],
    };

    await render(FormSocialLink, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_social_link._global.save",
        // No title prop here.
      },
    });

    // There should be exactly one h2 heading "Social links".
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBe(1);
    expect(headings[0].textContent || "").toMatch(/social links/i);
  });
});
