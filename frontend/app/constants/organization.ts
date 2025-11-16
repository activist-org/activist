// SPDX-License-Identifier: AGPL-3.0-or-later
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
