// SPDX-License-Identifier: AGPL-3.0-or-later
export interface SocialLink {
  link: string;
  label: string;
  order: number;
  creationDate: string;
  lastUpdated: string;
}

export interface SocialLinkFormData {
  link: string;
  label: string;
  order: number;
}
