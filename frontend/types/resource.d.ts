export interface Resource {
  // resource
  id: string;
  name: string;
  createdBy: User;
  description: string;
  // category: string;
  location: string;
  resourceURL: string;
  // isPrivate?: boolean;
  creationDate?: string;
  // lastUpdated?: string;
  // resource_star
  // starers: User;
  // resource_tag
  // tags: string[];
  // resource_topic
  // topics?: string[];
  // group_resource
  group?: Group;
  // organization_resource
  organization: Organization;
}
