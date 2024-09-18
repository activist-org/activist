// MARK: Main Table

export interface User {
  id: string;
  user_name: string;
  name: string;
  location?: string;
  description?: string;
  iconURL?: string;
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
  userID: string;
  resourceID: string;
}

export interface UserTask {
  userID: string;
  taskID: string;
}

export interface UserTopic {
  userID: string;
  topicID: string;
}
