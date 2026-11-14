// SPDX-License-Identifier: AGPL-3.0-or-later
// See: backend/authentication/models.py

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

export interface UserResponse {
  id: string;
  username: string;
  supportedEvents: CommunityEvent[];
  supportedOrganizations: Organization[];
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
