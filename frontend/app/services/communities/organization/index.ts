// SPDX-License-Identifier: AGPL-3.0-or-later
export * from "./event";
export * from "./faq";
export * from "./image";
export * from "./organization";
export * from "./resource";
export * from "./social-link";
export * from "./text";

// MARK: Organization-Related Base URLs
export const organizationUrl = `${communitiesBaseUrl}/organizations`
export const organizationResourcesUrl = `${communitiesBaseUrl}/organization_resources`
export const organizationSocialLinkUrl = `${communitiesBaseUrl}/organization_social_links`
export const organizationFaqUrl = `${communitiesBaseUrl}/organization_faqs`
export const organizationTextsUrl = `${communitiesBaseUrl}/organization_texts`

// This variable sets the URL that a filter of organizations by user query is sent to.
export const organizationByUserQueryUrl = `${communitiesBaseUrl}/organizations_by_user`

// This function computes the organization image URL based on the entity ID that is used for uploading and fetching organization images.
// Replaces hard-coding "/communities/organization/${entityID}/images".
export function computeOrganizationImagesUrlBasedOnEntityId(entityId: string):string {
    return `${communitiesBaseUrl}/organization/${entityId}/images`
}