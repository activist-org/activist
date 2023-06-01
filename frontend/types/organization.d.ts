export interface Organization {
  name: string;
  tagline?: string;
  location: string;
  description: string;
  topic: string;
  members: number;
  supporters: number;
  imageURL?: string;
  workingGroupURLs?: Array<string>;
}
