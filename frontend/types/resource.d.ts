export interface Resource {
  name: string;
  organization: string;
  resourceURL: string;
  description: string;
  topic: string;
  relatedLocation?: string;
  creationDate: datetime;
  stars: number;
  imageURL?: string;
}
