export interface DiscussionEntry {
  title: string;
  author: string;
  category: string;
  text: string;
  upVoters: number;
  participants: number;
  messages: number;
  creationDate: datetime;
}
