// SPDX-License-Identifier: AGPL-3.0-or-later

import { del, post, put } from "~/services/http";

// MARK: Create

export async function createGroupSocialLinks(
  groupId: string,
  links: SocialLinkInput[]
): Promise<void> {
  try {
    await Promise.all(
      links.map((data) =>
        post(
          `/communities/group_social_links`,
          {
            link: data.link,
            label: data.label,
            order: data.order,
            group: groupId,
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

export async function updateGroupSocialLink(
  linkId: string,
  data: { link: string; label: string; order: number; group: string }
): Promise<void> {
  try {
    await put(`/communities/group_social_links/${linkId}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteGroupSocialLink(linkId: string): Promise<void> {
  try {
    await del(`/communities/group_social_links/${linkId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Replace All

// Note: Deletes all links then recreates.
export async function replaceAllGroupSocialLinks(
  groupId: string,
  links: { link: string; label: string; order: number }[]
): Promise<void> {
  try {
    // Backend expects a placeholder payload to bulk-delete.
    await del(`/communities/group_social_links`, {
      // Ensure JSON content-type for bodies on DELETE if your backend needs it.
      headers: { "Content-Type": "application/json" },
      body: {
        link: "https://www.example.com",
        label: "placeholder",
        group: groupId,
      },
    });
    await createGroupSocialLinks(groupId, links);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
