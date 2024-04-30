export interface Organization {
  // organization
  id: string;
  name: string;
  tagline: string;
  createdBy: User;
  iconURL?: string;
  location: string;
  getInvolvedURL?: string;
  socialLinks?: string[];
  status: number;
  // statusUpdated?: string;
  // acceptanceDate?: string;
  // deletionDate?: string;
  // organization_application
  // orgsInFavor?: Organization[];
  // orgsAgainst?: Organization[];
  creationDate?: string;
  // organization_event
  // events?: Event[];
  // organization_group
  groups?: Group[];
  // organization_image
  images?: string[];
  // organization_member
  // members?: User[];
  // admins?: User[];
  // comms?: User[];
  // organization_resource
  resources?: Resource[];
  // organization_task
  // tasks?: Task[];
  // organization_text
  description?: string;
  getInvolved?: string;
  // donationPrompt?: string;
  // organization_topic
  // topics: string[];
  // discussion
  discussions?: Discussion[];
  // faq
  faqEntries?: FaqEntry[];
  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}
