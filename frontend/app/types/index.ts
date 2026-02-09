export enum TopicEnum {
  CLIMATE = 'CLIMATE',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  HUMAN_RIGHTS = 'HUMAN_RIGHTS',
  ENVIRONMENT = 'ENVIRONMENT',
  SOCIAL_JUSTICE = 'SOCIAL_JUSTICE',
  ANIMAL_RIGHTS = 'ANIMAL_RIGHTS',
  ECONOMIC_JUSTICE = 'ECONOMIC_JUSTICE',
  // Add your actual topic values here
}

export interface OrganizationFilters {
  topics?: TopicEnum[];
  status?: string;
  search?: string;
}

export interface Organization {
  id: string | number;
  name: string;
  description?: string;
  tagline?: string;
  status?: string;
  topics?: TopicEnum[];
  // Add other fields your organization objects have
}