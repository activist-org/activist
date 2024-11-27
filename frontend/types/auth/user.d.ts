// MARK: Main Table

export interface User {
  id: string;
  userName: string;
  name: string;
  location?: string;
  description?: string;
  iconUrl?: string;
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
