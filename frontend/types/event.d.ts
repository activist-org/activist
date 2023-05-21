export interface Event {
  name: string;
  organizer: string;
  topic: string;
  description: string;
  inPersonLocation?: string;
  onlineLocation?: sting;
  date: datetime;
  supporters: number;
  imageURL?: string;
}
