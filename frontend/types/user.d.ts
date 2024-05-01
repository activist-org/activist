export interface User {
  // user
  id: string;
  user_name: string;
  name: string;
  location?: string;
  description?: string;
  iconURL?: string;
  // verified?: boolean;
  // verificationMethod?: string;
  // verificationPartner?: User;
  email?: string;
  socialLinks?: string[];
  // isPrivate: boolean;
  // isHighRisk: boolean;
  // creationDate: string;
  // user_resource
  // resources?: Resource[];
  // user_task
  // tasks?: Task[];
  // user_topic
  // topics?: string[];
  // support
  // supportingOrgs?: Organization[];
  // supportingUsers?: User[];
}
