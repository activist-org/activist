import type { Organization } from "../entities/organization";

// MARK: Main Table

export interface Resource {
  id: string;
  name: string;
  createdBy: User;
  description: string;
  // category: string;
  organization: Organization;
  location: string;
  resourceURL: string;
  // isPrivate?: boolean;
  creationDate?: string;
  // lastUpdated?: string;
}

// MARK: Bridge Tables

export interface ResourceStar {
  resourceID: string;
  user_id: string;
}

export interface ResourceTag {
  resourceID: string;
  tagID: string;
}

export interface ResourceTopic {
  resourceID: string;
  topicID: string;
}
