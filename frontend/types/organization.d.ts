export interface Organization {
  name: string;
  location: string;
  description: string;
  topic: string;
  members: number;
  supporters: number;
  imageURL?: string;
}
