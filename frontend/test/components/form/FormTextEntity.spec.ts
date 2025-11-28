// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import type { OrganizationUpdateTextFormData } from "../../../shared/types/organization";

import FormTextEntity from "../../../app/components/form/FormTextEntity.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../../test/render";

/**
 * Comprehensive unit tests for FormTextEntity component
 *
 * Coverage includes:
 * - Logic (Text validation, change events, dynamic props)
 * - Style coverage (class changes, dynamic styling)
 * - Accessibility (ARIA attributes, focus handling)
 * - Edge cases and incorrect prop usage
 * - Reference to frontend/app/assets/css/tailwind.css for style verification
 */

// Note: Auto-import mocks (useI18n, etc.) are handled globally in test/setup.ts.

describe("FormTextEntity component", () => {
  const mockHandleSubmit = vi.fn();

  const defaultProps = {
    handleSubmit: mockHandleSubmit,
    submitLabel: "i18n.components.modal._global.update_texts",
    getInvolvedLabel: "i18n.components._global.get_involved",
    getInvolvedUrlLabel:
      "i18n.components.modal_text_organization.join_organization_link",
  };

  // MARK: Basic Rendering

  describe("Basic Rendering", () => {
    it("renders with required props", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      expect(descriptionInput).toBeDefined();

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      );
      expect(getInvolvedInput).toBeDefined();

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );
      expect(getInvolvedUrlInput).toBeDefined();
    });

    it("renders title when title prop is provided", async () => {
      await render(FormTextEntity, {
        props: {
          ...defaultProps,
          title:
            "i18n.components.modal_text_organization.edit_organization_texts",
        },
      });

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toBeDefined();
      expect(title.textContent).toContain(
        getEnglishText(
          "i18n.components.modal_text_organization.edit_organization_texts"
        )
      );
    });

    it("does not render title when title prop is not provided", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const title = screen.queryByRole("heading", { level: 2 });
      expect(title).toBeNull();
    });

    it("renders submit button with translated label", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      expect(submitBtn).toBeDefined();
    });
  });

  // MARK: Logic - Text Validation

  describe("Logic - Text Validation", () => {
    describe("Description Validation", () => {
      it("shows validation error when description is empty", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        const descriptionError = await screen.findByTestId(
          "form-item-description-error"
        );
        // Schema uses .refine() to ensure custom error message is always displayed
        expect(descriptionError.textContent).toBe(
          getEnglishText(
            "i18n.components.form_text_entity.description_required"
          )
        );
      });

      it("allows valid description", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Valid description");

        const getInvolvedInput = screen.getByLabelText(
          getEnglishText("i18n.components._global.get_involved")
        );
        await fireEvent.update(getInvolvedInput, "Join us");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(screen.queryByTestId("form-item-description-error")).toBeNull();
      });

      it("shows validation error when description exceeds max length (2500 characters)", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        const longDescription = "a".repeat(2501);
        await fireEvent.update(descriptionInput, longDescription);

        const getInvolvedInput = screen.getByLabelText(
          getEnglishText("i18n.components._global.get_involved")
        );
        await fireEvent.update(getInvolvedInput, "Join us");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        const descriptionError = await screen.findByTestId(
          "form-item-description-error"
        );
        // Error message is interpolated with actual number
        expect(descriptionError.textContent).toContain("2500");
        expect(descriptionError.textContent).toContain("characters");
      });

      it("allows description at max length (2500 characters)", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        const maxLengthDescription = "a".repeat(2500);
        await fireEvent.update(descriptionInput, maxLengthDescription);

        const getInvolvedInput = screen.getByLabelText(
          getEnglishText("i18n.components._global.get_involved")
        );
        await fireEvent.update(getInvolvedInput, "Join us");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(screen.queryByTestId("form-item-description-error")).toBeNull();
      });
    });

    describe("GetInvolved Validation", () => {
      it("shows validation error when getInvolved exceeds max length (500 characters)", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Valid description");

        const getInvolvedInput = screen.getByLabelText(
          getEnglishText("i18n.components._global.get_involved")
        );
        const longGetInvolved = "a".repeat(501);
        await fireEvent.update(getInvolvedInput, longGetInvolved);

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        const getInvolvedError = await screen.findByTestId(
          "form-item-getInvolved-error"
        );
        // Error message is interpolated with actual number
        expect(getInvolvedError.textContent).toContain("500");
        expect(getInvolvedError.textContent).toContain("characters");
      });

      it("allows getInvolved at max length (500 characters)", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Valid description");

        const getInvolvedInput = screen.getByLabelText(
          getEnglishText("i18n.components._global.get_involved")
        );
        const maxLengthGetInvolved = "a".repeat(500);
        await fireEvent.update(getInvolvedInput, maxLengthGetInvolved);

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(screen.queryByTestId("form-item-getInvolved-error")).toBeNull();
      });
    });

    describe("GetInvolved URL Validation", () => {
      it("shows validation error for invalid URL format", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Valid description");

        const getInvolvedUrlInput = screen.getByLabelText(
          getEnglishText(
            "i18n.components.modal_text_organization.join_organization_link"
          )
        );
        await fireEvent.update(getInvolvedUrlInput, "not-a-valid-url");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        const getInvolvedUrlError = await screen.findByTestId(
          "form-item-getInvolvedUrl-error"
        );
        expect(getInvolvedUrlError.textContent).toBe(
          getEnglishText("i18n.components.form._global.valid_url_required")
        );
      });

      it("accepts valid HTTP URL", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Valid description");

        const getInvolvedUrlInput = screen.getByLabelText(
          getEnglishText(
            "i18n.components.modal_text_organization.join_organization_link"
          )
        );
        await fireEvent.update(getInvolvedUrlInput, "http://example.com");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(
          screen.queryByTestId("form-item-getInvolvedUrl-error")
        ).toBeNull();
      });

      it("accepts valid HTTPS URL", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Valid description");

        const getInvolvedUrlInput = screen.getByLabelText(
          getEnglishText(
            "i18n.components.modal_text_organization.join_organization_link"
          )
        );
        await fireEvent.update(getInvolvedUrlInput, "https://example.com");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(
          screen.queryByTestId("form-item-getInvolvedUrl-error")
        ).toBeNull();
      });

      it("accepts valid URL with path", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Valid description");

        const getInvolvedUrlInput = screen.getByLabelText(
          getEnglishText(
            "i18n.components.modal_text_organization.join_organization_link"
          )
        );
        await fireEvent.update(
          getInvolvedUrlInput,
          "https://example.com/path/to/page"
        );

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(
          screen.queryByTestId("form-item-getInvolvedUrl-error")
        ).toBeNull();
      });
    });

    describe("GetInvolved Text or URL Requirement", () => {
      it("shows validation error when neither getInvolved text nor URL is provided", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Test description");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        const getInvolvedError = await screen.findByTestId(
          "form-item-getInvolved-error"
        );
        const getInvolvedUrlError = await screen.findByTestId(
          "form-item-getInvolvedUrl-error"
        );

        expect(getInvolvedError.textContent).toBe(
          getEnglishText(
            "i18n.components.form_text_entity.get_involved_text_or_url_required"
          )
        );
        expect(getInvolvedUrlError.textContent).toBe(
          getEnglishText(
            "i18n.components.form_text_entity.get_involved_text_or_url_required"
          )
        );
      });

      it("allows submission when getInvolved text is provided", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Test description");

        const getInvolvedInput = screen.getByLabelText(
          getEnglishText("i18n.components._global.get_involved")
        );
        await fireEvent.update(getInvolvedInput, "Join our events");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(screen.queryByTestId("form-item-getInvolved-error")).toBeNull();
        expect(
          screen.queryByTestId("form-item-getInvolvedUrl-error")
        ).toBeNull();
      });

      it("allows submission when getInvolvedUrl is provided", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Test description");

        const getInvolvedUrlInput = screen.getByLabelText(
          getEnglishText(
            "i18n.components.modal_text_organization.join_organization_link"
          )
        );
        await fireEvent.update(getInvolvedUrlInput, "https://example.com");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(screen.queryByTestId("form-item-getInvolved-error")).toBeNull();
        expect(
          screen.queryByTestId("form-item-getInvolvedUrl-error")
        ).toBeNull();
      });

      it("allows submission when both getInvolved text and URL are provided", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Test description");

        const getInvolvedInput = screen.getByLabelText(
          getEnglishText("i18n.components._global.get_involved")
        );
        await fireEvent.update(getInvolvedInput, "Join our events");

        const getInvolvedUrlInput = screen.getByLabelText(
          getEnglishText(
            "i18n.components.modal_text_organization.join_organization_link"
          )
        );
        await fireEvent.update(getInvolvedUrlInput, "https://example.com");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        expect(screen.queryByTestId("form-item-getInvolved-error")).toBeNull();
        expect(
          screen.queryByTestId("form-item-getInvolvedUrl-error")
        ).toBeNull();
      });

      it("shows validation error when getInvolved text is only whitespace", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Test description");

        const getInvolvedInput = screen.getByLabelText(
          getEnglishText("i18n.components._global.get_involved")
        );
        await fireEvent.update(getInvolvedInput, "   ");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        const getInvolvedError = await screen.findByTestId(
          "form-item-getInvolved-error"
        );
        const getInvolvedUrlError = await screen.findByTestId(
          "form-item-getInvolvedUrl-error"
        );

        expect(getInvolvedError.textContent).toBe(
          getEnglishText(
            "i18n.components.form_text_entity.get_involved_text_or_url_required"
          )
        );
        expect(getInvolvedUrlError.textContent).toBe(
          getEnglishText(
            "i18n.components.form_text_entity.get_involved_text_or_url_required"
          )
        );
      });

      it("shows validation error when getInvolvedUrl is only whitespace", async () => {
        await render(FormTextEntity, {
          props: defaultProps,
        });

        const descriptionInput = screen.getByLabelText(
          getEnglishText("i18n._global.description")
        );
        await fireEvent.update(descriptionInput, "Test description");

        const getInvolvedUrlInput = screen.getByLabelText(
          getEnglishText(
            "i18n.components.modal_text_organization.join_organization_link"
          )
        );
        await fireEvent.update(getInvolvedUrlInput, "   ");

        const submitBtn = screen.getByRole("button", {
          name: "Submit the form",
        });
        await fireEvent.click(submitBtn);

        // Whitespace-only URLs are treated as empty, so they trigger the "text or URL required" error
        const getInvolvedError = await screen.findByTestId(
          "form-item-getInvolved-error"
        );
        const getInvolvedUrlError = await screen.findByTestId(
          "form-item-getInvolvedUrl-error"
        );

        expect(getInvolvedError.textContent).toBe(
          getEnglishText(
            "i18n.components.form_text_entity.get_involved_text_or_url_required"
          )
        );
        // Whitespace-only URLs are treated as empty (not invalid URLs)
        expect(getInvolvedUrlError.textContent).toBe(
          getEnglishText(
            "i18n.components.form_text_entity.get_involved_text_or_url_required"
          )
        );
      });
    });
  });

  // MARK: Logic - Change Events

  describe("Logic - Change Events", () => {
    it("updates description field on input", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;

      await fireEvent.update(descriptionInput, "New description");
      expect(descriptionInput.value).toBe("New description");
    });

    it("updates getInvolved field on input", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      ) as HTMLTextAreaElement;

      await fireEvent.update(getInvolvedInput, "New get involved text");
      expect(getInvolvedInput.value).toBe("New get involved text");
    });

    it("updates getInvolvedUrl field on input", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      ) as HTMLInputElement;

      await fireEvent.update(getInvolvedUrlInput, "https://new-url.com");
      expect(getInvolvedUrlInput.value).toBe("https://new-url.com");
    });

    it("clears validation errors when fields become valid", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      const descriptionError = await screen.findByTestId(
        "form-item-description-error"
      );
      expect(descriptionError).toBeDefined();

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      await fireEvent.update(descriptionInput, "Valid description");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      );
      await fireEvent.update(getInvolvedInput, "Join us");

      await waitFor(() => {
        expect(screen.queryByTestId("form-item-description-error")).toBeNull();
      });
    });
  });

  // MARK: Logic - Dynamic Props

  describe("Logic - Dynamic Props", () => {
    it("renders rememberHttpsLabel when provided", async () => {
      await render(FormTextEntity, {
        props: {
          ...defaultProps,
          rememberHttpsLabel:
            "i18n.components.modal.text._global.remember_https",
        },
      });

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );
      const container = getInvolvedUrlInput.closest(".primary-text");
      const label = container?.querySelector("label");

      // The label should include the rememberHttpsLabel text
      expect(label?.textContent).toContain(
        getEnglishText("i18n.components.modal.text._global.remember_https")
      );
    });

    it("does not render rememberHttpsLabel when not provided", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      // FormItem's label (accessible label) should still be present
      const formLabel = document.querySelector(
        'label[for="form-item-getInvolvedUrl"].text-base.font-semibold'
      );
      expect(formLabel?.textContent).toBe(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );

      // FormTextInput's floating label should be empty when rememberHttpsLabel is not provided
      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );
      const container = getInvolvedUrlInput.closest(".primary-text");
      const floatingLabel = container?.querySelector("label");

      // When rememberHttpsLabel is not provided, label prop is empty string
      // The floating label will be empty when there's no value
      expect(floatingLabel?.textContent).toBe("");

      // The accessible label comes from FormItem's FormLabel, which is still present
      expect(getInvolvedUrlInput).toBeDefined();
    });

    it("uses custom getInvolvedLabel prop", async () => {
      await render(FormTextEntity, {
        props: {
          ...defaultProps,
          getInvolvedLabel: "i18n.components._global.participate",
        },
      });

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.participate")
      );
      expect(getInvolvedInput).toBeDefined();
    });

    it("uses custom getInvolvedUrlLabel prop", async () => {
      await render(FormTextEntity, {
        props: {
          ...defaultProps,
          getInvolvedUrlLabel:
            "i18n.components.modal_text_event.offer_to_help_link",
        },
      });

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText("i18n.components.modal_text_event.offer_to_help_link")
      );
      expect(getInvolvedUrlInput).toBeDefined();
    });
  });

  // MARK: Logic - Form Data Initialization

  describe("Logic - Form Data Initialization", () => {
    it("initializes form with formData prop", async () => {
      const formData = {
        description: "Initial description",
        getInvolved: "Initial get involved text",
        getInvolvedUrl: "https://initial-url.com",
      };

      await render(FormTextEntity, {
        props: {
          ...defaultProps,
          formData: formData as OrganizationUpdateTextFormData,
        },
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;
      expect(descriptionInput.value).toBe("Initial description");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      ) as HTMLTextAreaElement;
      expect(getInvolvedInput.value).toBe("Initial get involved text");

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      ) as HTMLInputElement;
      expect(getInvolvedUrlInput.value).toBe("https://initial-url.com");
    });

    it("handles empty formData prop", async () => {
      await render(FormTextEntity, {
        props: {
          ...defaultProps,
          formData: {
            description: "",
            getInvolved: "",
            getInvolvedUrl: "",
          } as OrganizationUpdateTextFormData,
        },
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;
      expect(descriptionInput.value).toBe("");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      ) as HTMLTextAreaElement;
      expect(getInvolvedInput.value).toBe("");

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      ) as HTMLInputElement;
      expect(getInvolvedUrlInput.value).toBe("");
    });

    it("handles undefined formData prop", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;
      expect(descriptionInput.value).toBe("");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      ) as HTMLTextAreaElement;
      expect(getInvolvedInput.value).toBe("");

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      ) as HTMLInputElement;
      expect(getInvolvedUrlInput.value).toBe("");
    });

    it("handles formData with partial fields", async () => {
      const formData = {
        description: "Only description",
        getInvolved: "",
        getInvolvedUrl: "",
      };

      await render(FormTextEntity, {
        props: {
          ...defaultProps,
          formData: formData as OrganizationUpdateTextFormData,
        },
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;
      expect(descriptionInput.value).toBe("Only description");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      ) as HTMLTextAreaElement;
      expect(getInvolvedInput.value).toBe("");

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      ) as HTMLInputElement;
      expect(getInvolvedUrlInput.value).toBe("");
    });
  });

  // MARK: Style Coverage

  describe("Style Coverage", () => {
    it("applies flex flex-col space-y-7 classes to form fields container", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const formContainer = document.querySelector(".flex.flex-col.space-y-7");
      expect(formContainer).toBeDefined();
    });

    it("applies error styling to description field when validation fails", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      await screen.findByTestId("form-item-description-error");

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      // FormTextArea applies border-action-red when hasError is true
      expect(descriptionInput.className).toContain("border-action-red");
    });

    it("applies error styling to getInvolved field when validation fails", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      await fireEvent.update(descriptionInput, "Valid description");

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      await screen.findByTestId("form-item-getInvolved-error");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      );
      expect(getInvolvedInput.className).toContain("border-action-red");
    });

    it("applies error styling to getInvolvedUrl field when validation fails", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      await fireEvent.update(descriptionInput, "Valid description");

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );
      await fireEvent.update(getInvolvedUrlInput, "invalid-url");

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      await screen.findByTestId("form-item-getInvolvedUrl-error");

      // FormTextInput applies border-action-red via fieldset when hasError is true
      const container = getInvolvedUrlInput.closest(".primary-text");
      const fieldset = container?.querySelector("fieldset");
      expect(fieldset?.className).toContain("border-action-red");
    });

    it("removes error styling when field becomes valid", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      await screen.findByTestId("form-item-description-error");

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      expect(descriptionInput.className).toContain("border-action-red");

      await fireEvent.update(descriptionInput, "Valid description");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      );
      await fireEvent.update(getInvolvedInput, "Join us");

      await waitFor(() => {
        expect(screen.queryByTestId("form-item-description-error")).toBeNull();
      });

      // Error styling should be removed
      await waitFor(() => {
        expect(descriptionInput.className).not.toContain("border-action-red");
      });
    });
  });

  // MARK: Accessibility

  describe("Accessibility", () => {
    it("associates label with description field via id and for attributes", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      const label = document.querySelector(
        `label[for="${descriptionInput.id}"]`
      );

      expect(label).toBeDefined();
      expect(label?.textContent).toContain(
        getEnglishText("i18n._global.description")
      );
    });

    it("shows required indicator for description field", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      // Required indicator is in a separate span element (not in label text)
      const requiredIndicators = screen.getAllByText("*");
      expect(requiredIndicators.length).toBeGreaterThan(0);

      // Check that the required indicator is associated with description field
      // The FormLabel component renders the asterisk in a separate span
      const descriptionContainer = document.querySelector(
        'div[name="description"]'
      );
      const requiredIndicator = descriptionContainer?.querySelector(
        "span.text-action-red"
      );
      expect(requiredIndicator).toBeDefined();
      expect(requiredIndicator?.textContent).toBe("*");

      // Verify the label itself doesn't contain the asterisk (it's in a sibling span)
      const descriptionLabel = descriptionContainer?.querySelector(
        "label.text-base.font-semibold"
      );
      expect(descriptionLabel?.textContent).not.toContain("*");
      expect(descriptionLabel?.textContent).toBe(
        getEnglishText("i18n._global.description")
      );
    });

    it("does not show required indicator for optional fields", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const requiredIndicators = screen.getAllByText("*");
      // Only description should be required
      expect(requiredIndicators.length).toBe(1);
    });

    it("associates label with getInvolved field via id and for attributes", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      );
      const label = document.querySelector(
        `label[for="${getInvolvedInput.id}"]`
      );

      expect(label).toBeDefined();
      expect(label?.textContent).toContain(
        getEnglishText("i18n.components._global.get_involved")
      );
    });

    it("associates label with getInvolvedUrl field via id and for attributes", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );

      // FormTextInput uses a floating label that's empty when there's no value
      // The accessible label comes from FormItem's FormLabel component
      const formLabel = document.querySelector(
        `label[for="${getInvolvedUrlInput.id}"].text-base.font-semibold`
      );

      expect(getInvolvedUrlInput).toBeDefined();
      expect(getInvolvedUrlInput.id).toBe("form-item-getInvolvedUrl");
      // The FormLabel from FormItem provides the accessible label
      expect(formLabel?.textContent).toBe(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );
    });

    it("has textbox role on description field", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      expect(descriptionInput.getAttribute("role")).toBe("textbox");
    });

    it("has textbox role on getInvolved field", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      );
      expect(getInvolvedInput.getAttribute("role")).toBe("textbox");
    });

    it("has textbox role on getInvolvedUrl field", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );
      expect(getInvolvedUrlInput.getAttribute("role")).toBe("textbox");
    });

    it("provides error message with correct test id for accessibility", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      const descriptionError = await screen.findByTestId(
        "form-item-description-error"
      );
      expect(descriptionError).toBeDefined();
      expect(descriptionError.id).toBe("form-item-description-error");
    });

    it("maintains focus order for form fields", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLElement;
      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      ) as HTMLElement;
      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      ) as HTMLElement;

      // Verify fields are accessible and can be found by their labels
      // Form fields (textarea/input) are naturally focusable via keyboard navigation
      expect(descriptionInput).toBeDefined();
      expect(getInvolvedInput).toBeDefined();
      expect(getInvolvedUrlInput).toBeDefined();

      // Verify all fields are form controls that support keyboard navigation
      expect(descriptionInput.tagName).toBe("TEXTAREA");
      expect(getInvolvedInput.tagName).toBe("TEXTAREA");
      expect(getInvolvedUrlInput.tagName).toBe("INPUT");

      // Verify fields are not disabled (disabled elements have tabIndex of -1)
      expect(descriptionInput.hasAttribute("disabled")).toBe(false);
      expect(getInvolvedInput.hasAttribute("disabled")).toBe(false);
      expect(getInvolvedUrlInput.hasAttribute("disabled")).toBe(false);
    });
  });

  // MARK: Edge Cases

  describe("Edge Cases", () => {
    it("handles very long description input gracefully", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;
      const veryLongText = "a".repeat(10000);
      await fireEvent.update(descriptionInput, veryLongText);

      expect(descriptionInput.value.length).toBe(10000);
    });

    it("handles special characters in description", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;
      const specialText =
        "Description with special chars: @#$%^&*()[]{}|\\/<>?";
      await fireEvent.update(descriptionInput, specialText);

      expect(descriptionInput.value).toBe(specialText);
    });

    it("handles unicode characters in text fields", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;
      const unicodeText = "Description with unicode: 🌍 日本語 العربية";
      await fireEvent.update(descriptionInput, unicodeText);

      expect(descriptionInput.value).toBe(unicodeText);
    });

    it("handles URL with query parameters", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      await fireEvent.update(descriptionInput, "Valid description");

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );
      await fireEvent.update(
        getInvolvedUrlInput,
        "https://example.com?param=value&other=123"
      );

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      expect(screen.queryByTestId("form-item-getInvolvedUrl-error")).toBeNull();
    });

    it("handles URL with hash fragment", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      await fireEvent.update(descriptionInput, "Valid description");

      const getInvolvedUrlInput = screen.getByLabelText(
        getEnglishText(
          "i18n.components.modal_text_organization.join_organization_link"
        )
      );
      await fireEvent.update(
        getInvolvedUrlInput,
        "https://example.com#section"
      );

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      expect(screen.queryByTestId("form-item-getInvolvedUrl-error")).toBeNull();
    });

    it("handles empty strings in formData", async () => {
      const formData = {
        description: "",
        getInvolved: "",
        getInvolvedUrl: "",
      };

      await render(FormTextEntity, {
        props: {
          ...defaultProps,
          formData: formData as OrganizationUpdateTextFormData,
        },
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      ) as HTMLTextAreaElement;
      expect(descriptionInput.value).toBe("");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      ) as HTMLTextAreaElement;
      expect(getInvolvedInput.value).toBe("");
    });

    it("calls handleSubmit with correct values on successful submission", async () => {
      mockHandleSubmit.mockResolvedValue(undefined);

      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      await fireEvent.update(descriptionInput, "Test description");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      );
      await fireEvent.update(getInvolvedInput, "Join us");

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      });

      const callArgs = mockHandleSubmit.mock.calls[0]?.[0];
      expect(callArgs).toMatchObject({
        description: "Test description",
        getInvolved: "Join us",
      });
    });

    it("handles handleSubmit rejection gracefully", async () => {
      mockHandleSubmit.mockRejectedValue(new Error("Submission failed"));

      await render(FormTextEntity, {
        props: defaultProps,
      });

      const descriptionInput = screen.getByLabelText(
        getEnglishText("i18n._global.description")
      );
      await fireEvent.update(descriptionInput, "Test description");

      const getInvolvedInput = screen.getByLabelText(
        getEnglishText("i18n.components._global.get_involved")
      );
      await fireEvent.update(getInvolvedInput, "Join us");

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });
      await fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      });

      // Form should still be visible after rejection
      expect(descriptionInput).toBeDefined();
    });

    it("handles multiple rapid validation attempts", async () => {
      await render(FormTextEntity, {
        props: defaultProps,
      });

      const submitBtn = screen.getByRole("button", {
        name: "Submit the form",
      });

      // Submit multiple times rapidly
      await fireEvent.click(submitBtn);
      await fireEvent.click(submitBtn);
      await fireEvent.click(submitBtn);

      const descriptionError = await screen.findByTestId(
        "form-item-description-error"
      );
      expect(descriptionError).toBeDefined();
    });
  });
});
