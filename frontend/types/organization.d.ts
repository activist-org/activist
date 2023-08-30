export interface Organization {
  name: string;
  status: string;
  tagline?: string;
  location: string;
  description: string;
  topic: string;
  members: number;
  supporters: number;
  imageURL?: string;
  workingGroups?: string[];
  socialLinks?: string[];
}
