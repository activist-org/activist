// SPDX-License-Identifier: AGPL-3.0-or-later
import type { ContentImage } from "~~/shared/types/content/file";

import { defaultContentImage } from "~~/shared/types/content/file";

// MARK: Main Table

export interface User {
  id: string;
  userName: string;
  name: string;
  location?: string;
  description?: string;
  iconUrl?: ContentImage;
  // verified?: boolean;
  // verificationMethod?: string;
  // verificationPartner?: User;
  email?: string;
  socialLinks: string[];
  // isPrivate: boolean;
  // isHighRisk: boolean;
  // creationDate: string;
  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}

export const defaultUser: User = {
  id: "",
  userName: "",
  name: "",
  location: "",
  description: "",
  iconUrl: defaultContentImage,
  email: "",
  socialLinks: [""],
};

// MARK: Bridge Tables

export interface UserResource {
  userId: string;
  resourceId: string;
}

export interface UserTask {
  userId: string;
  taskId: string;
}

export interface UserTopic {
  userId: string;
  topicId: string;
}
