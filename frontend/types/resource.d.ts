export interface resource {
  name: string;
  organizer: string;
  resourceURL: string;
  description: string;
  topic: string;
  relatedLocation?: string;
  creationDate: datetime;
  stars: number;
  imageURL?: string;
}
