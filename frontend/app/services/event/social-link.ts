// SPDX-License-Identifier: AGPL-3.0-or-later

const socialLinkEventBaseUrl = `${eventBaseUrl}/event_social_links`;

// MARK: Create

export async function createEventSocialLinks(
  eventId: string,
  links: SocialLinkInput[]
): Promise<void> {
  try {
    await Promise.all(
      links.map((data) =>
        post(
          socialLinkEventBaseUrl,
          {
            link: data.link,
            label: data.label,
            order: data.order,
            event: eventId,
          },
          { headers: { "Content-Type": "application/json" } }
        )
      )
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

export async function updateEventSocialLink(
  eventId: string,
  linkId: string,
  data: { link: string; label: string; order: number }
): Promise<void> {
  try {
    await put(
      `${socialLinkEventBaseUrl}/${linkId}`,
      {
        ...data,
        event: eventId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteEventSocialLink(linkId: string): Promise<void> {
  try {
    await del(`${socialLinkEventBaseUrl}/${linkId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Replace All

// Note: Deletes all links then recreates.
export async function replaceAllEventSocialLinks(
  eventId: string,
  links: { link: string; label: string; order: number }[]
): Promise<void> {
  try {
    // Backend expects a placeholder payload to bulk-delete.
    await del(socialLinkEventBaseUrl, {
      // Ensure JSON content-type for bodies on DELETE if your backend needs it.
      headers: { "Content-Type": "application/json" },
      body: {
        link: "https://www.example.com",
        label: "placeholder",
        event: eventId,
      },
    });
    await createEventSocialLinks(eventId, links);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
