// SPDX-License-Identifier: AGPL-3.0-or-later
export * from "./faq";
export * from "./group";
export * from "./image";
export * from "./resource";
export * from "./social-link";
export * from "./text";


// MARK: Group-Related Base URLs
export const groupUrl = `${communitiesBaseUrl}/groups`
export const groupFaqUrl = `${communitiesBaseUrl}/group_faqs`
export const groupResourceUrl = `${communitiesBaseUrl}/group_resources`
export const groupSocialLinkUrl = `${communitiesBaseUrl}/group_social_links`

// This function computes the group image URL based on the entity ID that is used for uploading and fetching group images.
// Replaces hard-coding "/communities/group/${entityID}/images".
export function computeGroupImagesUrlBasedOnEntityId(entityId: string): string{
    return `${communitiesBaseUrl}/group/${entityId}/images`;
}
