// MARK: Community Base URL
export const communitiesBaseUrl = "/communities";

// MARK: Organization-Related Base URLs
export const organizationUrl = `${communitiesBaseUrl}/organizations`;
export const organizationResourcesUrl = `${communitiesBaseUrl}/organization_resources`;
export const organizationSocialLinkUrl = `${communitiesBaseUrl}/organization_social_links`;
export const organizationFaqUrl = `${communitiesBaseUrl}/organization_faqs`;
export const organizationTextsUrl = `${communitiesBaseUrl}/organization_texts`;

// This variable sets the URL that a filter of organizations by user query is sent to.
export const organizationByUserQueryUrl = `${communitiesBaseUrl}/organizations_by_user`;

// This function computes the organization image URL based on the entity ID that is used for uploading and fetching organization images.
// Replaces hard-coding "/communities/organization/${entityID}/images".
export function computeOrganizationImagesUrlBasedOnEntityId(
  entityId: string
): string {
  return `${communitiesBaseUrl}/organization/${entityId}/images`;
}


// MARK: Group-Related Base URLs
export const groupUrl = `${communitiesBaseUrl}/groups`;
export const groupFaqUrl = `${communitiesBaseUrl}/group_faqs`;
export const groupResourceUrl = `${communitiesBaseUrl}/group_resources`;
export const groupSocialLinkUrl = `${communitiesBaseUrl}/group_social_links`;
export const groupTextsUrl = `${communitiesBaseUrl}/group_texts`;

// This function computes the group image URL based on the entity ID that is used for uploading and fetching group images.
// Replaces hard-coding "/communities/group/${entityID}/images".
export function computeGroupImagesUrlBasedOnEntityId(entityId: string): string {
    return `${communitiesBaseUrl}/group/${entityId}/images`;
}
