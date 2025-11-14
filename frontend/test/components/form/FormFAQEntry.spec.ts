// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import FormFAQEntry from "~/components/form/FormFAQEntry.vue";

import render from "../../render";

const SUBMIT_LABEL_KEY =
  "i18n.components.modal.faq_entry._global.add_faq_entry";

describe("FormFAQEntry", () => {
  it("renders title, initial data, and custom submit label", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const formData = {
      id: "faq-1",
      iso: "en",
      order: 1,
      question: "What is Activist?",
      answer: "An open-source platform.",
    };

    await render(FormFAQEntry, {
      props: {
        formData,
        handleSubmit,
        submitLabel: SUBMIT_LABEL_KEY,
        title: "i18n.components.modal.faq_entry._global.edit_entry",
      },
    });

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toMatch(/Edit FAQ Entry/i);

    const questionArea = screen.getByRole("textbox", {
      name: "Question",
    }) as HTMLTextAreaElement;
    const answerArea = screen.getByRole("textbox", {
      name: "Answer",
    }) as HTMLTextAreaElement;

    expect(questionArea.value).toBe(formData.question);
    expect(answerArea.value).toBe(formData.answer);

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    expect(submitButton.textContent).toMatch(/Add FAQ entry/i);

    const questionLabel = screen.getByText("Question") as HTMLLabelElement;
    expect(questionArea.id).toBe(questionLabel.getAttribute("for"));
  });

  it("validates required fields and applies error styling", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormFAQEntry, {
      props: {
        handleSubmit,
        submitLabel: SUBMIT_LABEL_KEY,
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    const errorQuestion = await screen.findByTestId("form-item-question-error");
    const errorAnswer = await screen.findByTestId("form-item-answer-error");
    expect(errorQuestion.textContent).toMatch(/required/i);
    expect(errorAnswer.textContent).toMatch(/required/i);

    const questionArea = screen.getByRole("textbox", { name: "Question" });
    const answerArea = screen.getByRole("textbox", { name: "Answer" });

    await waitFor(() => {
      expect(questionArea.className).toContain("border-action-red");
      expect(answerArea.className).toContain("border-action-red");
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid FAQ data", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    await render(FormFAQEntry, {
      props: {
        handleSubmit,
        submitLabel: SUBMIT_LABEL_KEY,
      },
    });

    const questionArea = screen.getByRole("textbox", { name: "Question" });
    const answerArea = screen.getByRole("textbox", { name: "Answer" });

    await fireEvent.update(questionArea, "What does the platform provide?");
    await fireEvent.update(answerArea, "It offers organizing tools.");

    const submitButton = screen.getByRole("button", {
      name: /submit the form/i,
    });
    await fireEvent.click(submitButton);

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
    expect(handleSubmit).toHaveBeenCalledWith({
      answer: "It offers organizing tools.",
      question: "What does the platform provide?",
    });
  });
});
