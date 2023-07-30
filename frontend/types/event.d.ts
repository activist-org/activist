export interface Event {
  name: string;
  tagline: string;
  organizer: string;
  type: string = "act" | "learn";
  topic: string;
  description: string;
  getInvolvedDescription: string;
  inPersonLocation?: string;
  onlineLocation?: sting;
  date?: datetime;
  supporters: number;
  imageURL?: string;
  socialLinks?: [string];
}
