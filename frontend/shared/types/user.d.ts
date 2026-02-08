// SPDX-License-Identifier: AGPL-3.0-or-later
import type { ContentImage } from "~~/shared/types/content/file";

import { defaultContentImage } from "~~/shared/types/content/file";

export interface UserActivist {
  id: string;
  userName: string;
  name: string;
  location: string;
  description: string;
  iconUrl: ContentImage;
  email: string;
  socialLinks: string[];
}

export const defaultUser: UserActivist = {
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
