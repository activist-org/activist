// SPDX-License-Identifier: AGPL-3.0-or-later
export interface SocialLink {
  id: string;
  link: string;
  label: string;
  order: number;
  creationDate: string;
  lastUpdated: string;
}

export const defaultSocialLink: SocialLink = {
  id: "",
  link: "",
  label: "",
  order: 0,
  creationDate: "",
  lastUpdated: "",
};

export interface SocialLinkFormData {
  id: string;
  link: string;
  label: string;
  order: number;
}
