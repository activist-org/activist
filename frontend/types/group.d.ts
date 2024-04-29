export interface Group {
  id: string;
  name: string;
  organization: Organization;
  tagline: string;
  location: string;
  description: string;
  topic: string;
  members: number;
  supporters: number;
  imageURL?: string;
  socialLinks?: string[];
  donationPrompt?: string;
}
