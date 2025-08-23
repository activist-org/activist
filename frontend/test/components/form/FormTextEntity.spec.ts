// SPDX-License-Identifier: AGPL-3.0-or-later
import FormTextEntity from "@/components/form/FormTextEntity.vue";
import render from "@/test/render";
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import { getEnglishText } from "~/utils/i18n";

describe("FormTextEntity component", () => {
  const mockHandleSubmit = vi.fn();

  const defaultProps = {
    handleSubmit: mockHandleSubmit,
    submitLabel: "i18n.components.modal._global.update_texts",
    getInvolvedLabel: "i18n.components._global.get_involved",
    getInvolvedUrlLabel:
      "i18n.components.modal_text_organization.join_organization_link",
  };

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

    // Fill in thr required fields.
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

    // Shouldn't show validation errors.
    expect(screen.queryByTestId("form-item-getInvolved-error")).toBeNull();
    expect(screen.queryByTestId("form-item-getInvolvedUrl-error")).toBeNull();
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
    expect(screen.queryByTestId("form-item-getInvolvedUrl-error")).toBeNull();
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
    expect(screen.queryByTestId("form-item-getInvolvedUrl-error")).toBeNull();
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
});
