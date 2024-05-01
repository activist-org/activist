export interface Group {
  // group
  id: string;
  name: string;
  tagline?: string;
  organization: Organization;
  createdBy: User;
  // category?: string;
  location: string;
  getInvolvedURL?: string;
  socialLinks?: string[];
  creationDate?: string;
  // deletionDate?: string;
  // group_event
  // events?: Event[];
  // group_image
  images?: string[];
  // group_member
  // members?: User[];
  // owners?: User[];
  // admins?: User[];
  // comms?: User[];
  // group_resources
  resources?: Resource[];
  // group_text
  description?: string;
  getInvolved?: string;
  // donationPrompt?: string;
  // group_topic
  // topics: string[];
  // faq
  faqEntries?: FaqEntry[];
  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}
