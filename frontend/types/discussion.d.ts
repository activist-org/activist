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
