import type { Location } from "~/types/content/location";
import type { Organization } from "../communities/organization";

// MARK: Main Table

export interface Resource {
  id: string;
  name: string;
  createdBy: User;
  description: string;
  // category: string;
  organization: Organization;
  location: Location;
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
