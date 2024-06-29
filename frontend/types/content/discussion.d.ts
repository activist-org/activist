// MARK: Main Table

export interface Discussion {
  title: string;
  createdBy: User;
  orgID?: Organization;
  eventID?: Event;
  // voteID?: Vote;
  category: string;
  upVoters: User[];
  participants: User[];
  messages: number;
  creationDate: string;
}

// MARK: Bridge Tables

export interface DiscussionEntry {
  id: number;
  authorImg?: string;
  author: string;
  content: string;
  votes: number;
  date: datetime;
}

export interface DiscussionInput {
  name: string;
  location?: string;
  supporters: number;
  description: string;
  category: string;
  highRisk: boolean;
}
