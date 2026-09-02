// SPDX-License-Identifier: AGPL-3.0-or-later
import { del, post, put } from "~/services/http";

// MARK: Create

export async function createOrganizationSocialLinks(
  orgId: string,
  links: SocialLinkInput[]
): Promise<void> {
  try {
    await Promise.all(
      links.map((data) =>
        post(
          `/communities/organization_social_links`,
          {
            link: data.link,
            label: data.label,
            order: data.order,
            org: orgId,
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

export async function updateOrganizationSocialLink(
  orgId: string,
  linkId: string,
  data: { link: string; label: string; order: number }
): Promise<void> {
  try {
    await put(
      `/communities/organization_social_links/${linkId}`,
      {
        ...data,
        org: orgId,
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

export async function deleteOrganizationSocialLink(
  linkId: string
): Promise<void> {
  try {
    await del(`/communities/organization_social_links/${linkId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Replace All

// Note: Deletes all links then recreates.
export async function replaceAllOrganizationSocialLinks(
  orgId: string,
  links: { link: string; label: string; order: number }[]
): Promise<void> {
  try {
    // Backend expects a placeholder payload to bulk-delete.
    await del(`/communities/organization_social_links`, {
      // Ensure JSON content-type for bodies on DELETE if your backend needs it.
      headers: { "Content-Type": "application/json" },
      body: {
        link: "https://www.example.com",
        label: "placeholder",
        org: orgId,
      },
    });
    await createOrganizationSocialLinks(orgId, links);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
