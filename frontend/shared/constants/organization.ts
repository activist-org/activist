import { defaultContentImage } from "#shared/constants/file";
import { defaultLocation } from "#shared/constants/location";
import { defaultSocialLink } from "#shared/constants/social-link";

export const defaultOrganizationSocialLink = {
  orgId: "",
  ...defaultSocialLink,
};
export const defaultOrganizationText = {
  id: 0,
  orgId: "",
  iso: "",
  primary: false,
  description: "",
  getInvolved: "",
  donationPrompt: "",
};

export const defaultOrganization = {
  id: "",
  orgName: "",
  name: "",
  tagline: "",
  createdBy: "",
  iconUrl: defaultContentImage,
  location: defaultLocation,
  socialLinks: [defaultOrganizationSocialLink],
  status: 0,
  creationDate: "",
  texts: [defaultOrganizationText],
};
