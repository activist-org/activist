// SPDX-License-Identifier: AGPL-3.0-or-later
import type { FaqEntry } from "~/types/content/faq-entry";

interface FaqEntryStore {
  loading: boolean;
  faqEntry: FaqEntry;
  faqEntries: FaqEntry[];
}

export const useFaqEntryStore = defineStore("faqEntry", {
  // MARK: Properties

  state: (): FaqEntryStore => ({
    loading: false,

    faqEntry: {
      id: "",
      question: "",
      answer: "",
      iso: "en",
      order: 0,
    },

    faqEntries: [],
  }),
  actions: {
    // MARK: Update

    async update(
      entityType: "organization" | "group" | "event",
      entityId: string,
      formData: FaqEntry
    ) {
      this.loading = true;
      const responses: boolean[] = [];

      const token = localStorage.getItem("accessToken");

      const responseFaqEntries = await useFetch(
        `${BASE_BACKEND_URL}/content/faqs/${entityType}/${entityId}/`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: formData.id,
            question: formData.question,
            answer: formData.answer,
          }),
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const responseFaqEntriesData = responseFaqEntries.data
        .value as unknown as FaqEntry;
      if (responseFaqEntriesData) {
        responses.push(true);
      } else {
        responses.push(false);
      }

      if (responses.every((r) => r === true)) {
        this.loading = false;
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },
  },
});
