// SPDX-License-Identifier: AGPL-3.0-or-later
import { del, post, put } from "~/services/http";

// MARK: Create

export async function createOrganizationFaq(
  organizationId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await post(
      `/communities/organization_faqs`,
      {
        iso: faq.iso,
        order: faq.order,
        question: faq.question,
        answer: faq.answer,
        org: organizationId,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

export async function updateOrganizationFaq(faq: FaqEntry): Promise<void> {
  try {
    await put(
      `/communities/organization_faqs/${faq.id}`,
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

export async function reorderOrganizationFaqs(faqs: FaqEntry[]): Promise<void> {
  try {
    await Promise.all(
      faqs.map(
        (f) =>
          put(`/communities/organization_faqs/${f.id}`, {
            id: f.id,
            order: f.order,
          }),
        { headers: { "Content-Type": "application/json" } }
      )
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteOrganizationFaq(faqId: string): Promise<void> {
  try {
    await del(`/communities/organization_faqs/${faqId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
