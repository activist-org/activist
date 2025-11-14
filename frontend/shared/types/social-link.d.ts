// SPDX-License-Identifier: AGPL-3.0-or-later
export interface SocialLink {
  id: string;
  link: string;
  label: string;
  order: number;
  creationDate: string;
  lastUpdated: string;
}

export type SocialLinkInput = Omit<SocialLink, "id" | "creationDate" | "lastUpdated"> & { id?: string };

export interface SocialLinkFormData {
  socialLinks: SocialLinkInput[];
}
