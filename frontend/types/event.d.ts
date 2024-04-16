export interface Event {
  name: string;
  tagline: string;
  organizations: Organization[];
  type: "action" | "learn";
  topic: string;
  description: string;
  getInvolvedDescription: string;
  attending?: number;
  inPersonLocation?: string;
  onlineLocation?: string;
  date: datetime;
  supporters: number;
  imageURL?: string;
  socialLinks?: string[];
}
