export interface Group {
  name: string;
  organization: string;
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
