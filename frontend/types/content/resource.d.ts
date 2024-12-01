import type { Organization } from "../entities/organization";

// MARK: Main Table

export interface Resource {
  id: string;
  name: string;
  createdBy: User;
  description: string;
  // category: string;
  organization: Organization;
  locationId: string;
  resourceUrl: string;
  // isPrivate?: boolean;
  creationDate?: string;
  // lastUpdated?: string;
}

// MARK: Bridge Tables

export interface ResourceStar {
  resourceId: string;
  user_id: string;
}

export interface ResourceTag {
  resourceId: string;
  tagId: string;
}

export interface ResourceTopic {
  resourceId: string;
  topicId: string;
}
