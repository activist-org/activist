// SPDX-License-Identifier: AGPL-3.0-or-later
// MARK: Main Table

export interface Discussion {
  title: string;
  createdBy: User;
  orgId?: Organization;
  eventId?: Event;
  // voteId?: Vote;
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
