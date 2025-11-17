// SPDX-License-Identifier: AGPL-3.0-or-later
import { del, post, put } from "~/services/http";

// MARK: Create

export async function createGroupFaq(
  groupId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await post(
      `/communities/group_faqs`,
      {
        iso: faq.iso,
        order: faq.order,
        question: faq.question,
        answer: faq.answer,
        group: groupId,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

export async function updateGroupFaq(faq: FaqEntry): Promise<void> {
  try {
    await put(
      `/communities/group_faqs/${faq.id}`,
      {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder

export async function reorderGroupFaqs(faqs: FaqEntry[]): Promise<void> {
  try {
    await Promise.all(
      faqs.map(
        (f) =>
          put(`/communities/group_faqs/${f.id}`, { id: f.id, order: f.order }),
        { headers: { "Content-Type": "application/json" } }
      )
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteGroupFaq(faqId: string): Promise<void> {
  try {
    await del(`/communities/group_faqs/${faqId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
