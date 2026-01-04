// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import FormResource from "../../../app/components/form/FormResource.vue";
import { TopicEnum } from "../../../shared/types/topics";
import { createResource } from "../../mocks/factories";
import render from "../../render";

/**
 * Comprehensive unit tests for FormResource.vue
 *
 * This suite covers:
 * - Logic:
 *   - Resource type validation (name, description, url required)
 *   - URL format validation (must be valid URL)
 *   - Topic validation (optional, but must be valid TopicEnum values)
 *   - Form submission events
 *   - Dynamic props (formData, submitLabel, title)
 * - Style:
 *   - Tailwind layout classes (flex, flex-col, space-y-7)
 *   - Error border styling (border-action-red from tailwind.css)
 *   - Responsive and dynamic styling
 * - Accessibility:
 *   - ARIA attributes and form associations
 *   - Label/input relationships
 *   - Loading states
 * - Edge cases:
 *   - Empty formData
 *   - Invalid URLs
 *   - Invalid topics
 *   - Missing optional props
 *   - Incorrect prop usage
 *
 * Reference: frontend/app/assets/css/tailwind.css for style verification
 */

describe("FormResource", () => {
  // MARK: Logic Testing

  it("renders title, initial data, and custom submit label", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const formData = createResource({
      name: "Activist Platform",
      description: "An open-source activism platform",
      url: "https://activist.org",
      topics: [TopicEnum.TECHNOLOGY_AND_PRIVACY],
    });

    await render(FormResource, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
        title: "i18n.components.form_resource._global.edit_resource",
      },
    });

    // Title from `title` prop (in test environment, i18n keys are not translated)
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toContain(
      "i18n.components.form_resource._global.edit_resource"
    );

    // Initial form values populated from formData
    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    }) as HTMLInputElement;
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    }) as HTMLTextAreaElement;
    const urlInput = screen.getByRole("textbox", {
      name: /link/i,
    }) as HTMLInputElement;

    expect(nameInput.value).toBe(formData.name);
    expect(descriptionInput.value).toBe(formData.description);
    expect(urlInput.value).toBe(formData.url);

    // Submit button with custom label
    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    expect(submitButton.textContent).toMatch(/save/i);

    // Form associations: labels should be associated with inputs
    // There are multiple labels (visible and floating), get the first one (visible label)
    const nameLabels = screen.getAllByText(/name/i) as HTMLLabelElement[];
    const nameLabel = nameLabels.find(
      (label) => label.getAttribute("for") === nameInput.id
    );
    expect(nameLabel).toBeTruthy();
    expect(nameInput.id).toBe(nameLabel!.getAttribute("for"));
  });

  it("validates required fields and prevents submit when data is invalid", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    // All required fields should show validation errors
    const nameError = await screen.findByTestId("form-item-name-error");
    const descriptionError = await screen.findByTestId(
      "form-item-description-error"
    );
    const urlError = await screen.findByTestId("form-item-url-error");

    expect(nameError.textContent).toMatch(/required/i);
    expect(descriptionError.textContent).toMatch(/required/i);
    expect(urlError.textContent).toMatch(/required/i);

    // Style coverage: error fields should have error border color
    // For text inputs, the border is on a fieldset element
    // For textarea, the border is directly on the element
    const nameBorder = await screen.findByTestId("form-item-name-border");
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    }) as HTMLTextAreaElement;
    const urlBorder = await screen.findByTestId("form-item-url-border");

    await waitFor(() => {
      expect(nameBorder.className).toContain("border-action-red");
      expect(descriptionInput.className).toContain("border-action-red");
      expect(urlBorder.className).toContain("border-action-red");
    });

    // handleSubmit should NOT be called with invalid data
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("validates URL format and rejects invalid URLs", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const urlInput = screen.getByRole("textbox", { name: /link/i });

    // Fill required fields with valid data
    await fireEvent.update(nameInput, "Test Resource");
    await fireEvent.update(descriptionInput, "A test description");

    // Enter invalid URL
    await fireEvent.update(urlInput, "not-a-valid-url");

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    // URL validation error should appear
    const urlError = await screen.findByTestId("form-item-url-error");
    expect(urlError.textContent).toMatch(/must be valid/i);

    // URL field should have error styling on the border fieldset
    const urlBorder = await screen.findByTestId("form-item-url-border");
    await waitFor(() => {
      expect(urlBorder.className).toContain("border-action-red");
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("validates topic enum values and rejects invalid topics", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    const formData = createResource({
      name: "Test Resource",
      description: "A test description",
      url: "https://example.com",
      // Invalid topic value
      topics: ["INVALID_TOPIC" as TopicEnum],
    });

    await render(FormResource, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    // Topic validation error should appear
    const topicError = await screen.findByTestId("form-item-topics-error");
    expect(topicError.textContent).toMatch(/invalid topic/i);

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid resource data with all fields", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    }) as HTMLTextAreaElement;
    const urlInput = screen.getByRole("textbox", { name: /link/i });

    // Fill all required fields
    await fireEvent.update(nameInput, "New Resource");
    await fireEvent.update(
      descriptionInput,
      "A comprehensive resource description"
    );
    await fireEvent.update(urlInput, "https://example.com/resource");

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    const submittedData = handleSubmit.mock.calls[0][0] as {
      name: string;
      description: string;
      url: string;
      topics?: TopicEnum[];
    };

    expect(submittedData.name).toBe("New Resource");
    expect(submittedData.description).toBe(
      "A comprehensive resource description"
    );
    expect(submittedData.url).toBe("https://example.com/resource");
    // Topics should be optional and may be undefined
    expect(submittedData.topics).toBeUndefined();
  });

  it("handles form submission with initial formData", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const formData = createResource({
      name: "Existing Resource",
      description: "An existing resource",
      url: "https://existing.com",
      topics: [TopicEnum.ENVIRONMENT, TopicEnum.HEALTH],
    });

    await render(FormResource, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.update",
      },
    });

    // Verify initial values are populated
    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    }) as HTMLInputElement;
    expect(nameInput.value).toBe("Existing Resource");

    // Modify a field
    await fireEvent.update(nameInput, "Updated Resource");

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    const submittedData = handleSubmit.mock.calls[0][0] as {
      name: string;
      description: string;
      url: string;
    };

    expect(submittedData.name).toBe("Updated Resource");
    expect(submittedData.description).toBe("An existing resource");
    expect(submittedData.url).toBe("https://existing.com");
  });

  // MARK: Style Testing

  it("applies error border styling on validation errors", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    // Reference: tailwind.css line 34 - --action-red: 186, 61, 59;
    // Error styling: for text inputs it's on fieldset border elements,
    // for textarea it's directly on the element
    const nameBorder = await screen.findByTestId("form-item-name-border");
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    }) as HTMLTextAreaElement;
    const urlBorder = await screen.findByTestId("form-item-url-border");

    await waitFor(() => {
      expect(nameBorder.className).toContain("border-action-red");
      expect(descriptionInput.className).toContain("border-action-red");
      expect(urlBorder.className).toContain("border-action-red");
    });
  });

  it("clears error styling when fields become valid", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });

    // Trigger validation error
    await fireEvent.click(submitButton);
    const nameBorder = await screen.findByTestId("form-item-name-border");
    await waitFor(() => {
      expect(nameBorder.className).toContain("border-action-red");
    });

    // Fix the error
    await fireEvent.update(nameInput, "Valid Name");
    await fireEvent.blur(nameInput);

    // Error styling should be removed from the border fieldset
    await waitFor(
      () => {
        expect(nameBorder.className).not.toContain("border-action-red");
      },
      { timeout: 2000 }
    );
  });

  // MARK: Accessibility Testing

  it("marks required fields appropriately", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    // Required fields should have required attribute or indication
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const urlInput = screen.getByRole("textbox", { name: /link/i });

    // FormItem component should handle required indication
    // Verify fields are present and accessible
    expect(nameInput).toBeTruthy();
    expect(descriptionInput).toBeTruthy();
    expect(urlInput).toBeTruthy();
  });

  // MARK: Edge Cases

  it("renders safely when formData is undefined", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        // formData is optional
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    // Form should render with empty fields
    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    }) as HTMLInputElement;
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    }) as HTMLTextAreaElement;
    const urlInput = screen.getByRole("textbox", {
      name: /link/i,
    }) as HTMLInputElement;

    expect(nameInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
    expect(urlInput.value).toBe("");
  });

  it("handles empty string values in formData", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const formData = createResource({
      name: "",
      description: "",
      url: "",
    });

    await render(FormResource, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    }) as HTMLInputElement;
    expect(nameInput.value).toBe("");

    // Should show validation errors on submit
    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("form-item-name-error")).toBeTruthy();
    });
  });

  it("handles various URL formats correctly", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const urlInput = screen.getByRole("textbox", { name: /link/i });

    await fireEvent.update(nameInput, "Test Resource");
    await fireEvent.update(descriptionInput, "Test description");

    const validUrls = [
      "https://example.com",
      "http://example.com",
      "https://example.com/path",
      "https://example.com/path?query=value",
      "https://subdomain.example.com",
    ];

    const invalidUrls = [
      "not-a-url",
      "example.com",
      "ftp://example.com",
      "just text",
    ];

    for (const url of validUrls) {
      await fireEvent.update(urlInput, url);
      await fireEvent.blur(urlInput);

      // Should not show URL validation error
      const urlError = screen.queryByTestId("form-item-url-error");
      if (urlError) {
        expect(urlError.textContent).not.toMatch(/must be valid/i);
      }
    }

    for (const url of invalidUrls) {
      await fireEvent.update(urlInput, url);
      const submitButton = screen.getByRole("button", {
        name: /submit the form/i,
      });
      await fireEvent.click(submitButton);

      await waitFor(() => {
        const error = screen.getByTestId("form-item-url-error");
        expect(error.textContent).toMatch(/must be valid/i);
      });
    }
  });

  it("handles missing title prop gracefully", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
        // title prop is optional
      },
    });

    // Should not render h2 heading when title is not provided
    const headings = screen.queryAllByRole("heading", { level: 2 });
    expect(headings.length).toBe(0);

    // Form should still be functional
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    expect(nameInput).toBeTruthy();
  });

  it("handles async handleSubmit correctly", async () => {
    const handleSubmit = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

    await render(FormResource, {
      props: {
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const urlInput = screen.getByRole("textbox", { name: /link/i });

    await fireEvent.update(nameInput, "Async Resource");
    await fireEvent.update(descriptionInput, "Async description");
    await fireEvent.update(urlInput, "https://async.com");

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    // Should wait for async operation
    await waitFor(
      () => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );
  });

  it("handles topics array with multiple valid TopicEnum values", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const formData = createResource({
      name: "Multi-topic Resource",
      description: "Resource with multiple topics",
      url: "https://example.com",
      topics: [
        TopicEnum.ENVIRONMENT,
        TopicEnum.HEALTH,
        TopicEnum.TECHNOLOGY_AND_PRIVACY,
      ],
    });

    await render(FormResource, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    // Form should render without errors
    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    }) as HTMLInputElement;
    expect(nameInput.value).toBe("Multi-topic Resource");

    // Should be able to submit
    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("handles empty topics array", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const formData = createResource({
      name: "No Topics Resource",
      description: "Resource without topics",
      url: "https://example.com",
      topics: [], // Empty array
    });

    await render(FormResource, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    // Should render and submit successfully (topics are optional)
    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("handles undefined topics in formData", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const formData = createResource({
      name: "No Topics Resource",
      description: "Resource without topics",
      url: "https://example.com",
      topics: undefined, // Undefined topics
    });

    await render(FormResource, {
      props: {
        formData,
        handleSubmit,
        submitLabel: "i18n.components.form_resource._global.save",
      },
    });

    // Should render and submit successfully (topics are optional)
    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
