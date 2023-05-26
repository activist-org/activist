export interface Event {
  name: string;
  tagline: string;
  organizer: string;
  topic: string;
  description: string;
  getInvolvedDescription: string;
  inPersonLocation?: string;
  onlineLocation?: sting;
  date?: datetime;
  supporters: number;
  imageURL?: string;
}
