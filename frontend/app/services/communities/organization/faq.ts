// SPDX-License-Identifier: AGPL-3.0-or-later
// MARK: Create

export async function createOrganizationFaq(
  orgId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await post(
      `${communitiesBaseUrl}/organization_faqs`,
      {
        iso: faq.iso,
        order: faq.order,
        question: faq.question,
        answer: faq.answer,
        org: orgId,
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
      `${communitiesBaseUrl}/organization_faqs/${faq.id}`,
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
          put(`${communitiesBaseUrl}/organization_faqs/${f.id}`, {
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
    await del(`${communitiesBaseUrl}/organization_faqs/${faqId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
