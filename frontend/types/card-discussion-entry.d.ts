export interface DiscussionEntry {
  id: number;
  authorImg?: string;
  author: string;
  content: string;
  votes: number;
  date: datetime;
}
