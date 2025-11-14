// SPDX-License-Identifier: AGPL-3.0-or-later
import type { User } from "~/types/auth/user";
import type { Organization } from "~/types/communities/organization";
import type { PhysicalLocation } from "~/types/content/location";
import type { TopicEnum } from "~/types/content/topics";

// MARK: Main Table

export interface Resource {
  id: string;
  name: string;
  createdBy: User;
  description: string;
  // category: string;
  org?: Organization;
  location?: PhysicalLocation;
  url: string;
  topics?: TopicEnum[];
  category?: string;
  // isPrivate?: boolean;
  creationDate?: string;
  order: number;
  // lastUpdated?: string;
}

export interface ResourceInput {
  id: string;
  name: string;
  description: string;
  // category: string;
  orgId?: string;
  locationId?: string;
  url: string;
  topics?: TopicEnum[];
  category?: string;
  // isPrivate?: boolean;
}
