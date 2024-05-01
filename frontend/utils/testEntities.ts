import type { Discussion } from "~/types/discussion";
import type { Event } from "~/types/event";
import type { FaqEntry } from "~/types/faq-entry";
import type { Group } from "~/types/group";
import type { Organization } from "~/types/organization";
import type { Resource } from "~/types/resource";
import type { User } from "~/types/user";

export const testUser: User = {
  id: "1",
  user_name: "tester",
  name: "John A. Tester",
  location: "Testerville, TN",
  description: "I love to test!",
  // topics: ["Testing"],
};

const faqEntry_01: FaqEntry = {
  question: "FAQ question text 01",
  answer:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat bibendum libero in condimentum. Pellentesque euismod consequat mi ac mollis. In viverra, orci a consequat varius, nisi sem dictum ex, id fermentum purus quam non risus. Curabitur sit amet sem mollis, iaculis felis eu, viverra urna.",
};
const faqEntry_02: FaqEntry = {
  question: "FAQ question text 02",
  answer:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat bibendum libero in condimentum. Pellentesque euismod consequat mi ac mollis. In viverra, orci a consequat varius, nisi sem dictum ex, id fermentum purus quam non risus. Curabitur sit amet sem mollis, iaculis felis eu, viverra urna.",
};
const faqEntry_03: FaqEntry = {
  question: "FAQ question text 03",
  answer:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat bibendum libero in condimentum. Pellentesque euismod consequat mi ac mollis. In viverra, orci a consequat varius, nisi sem dictum ex, id fermentum purus quam non risus. Curabitur sit amet sem mollis, iaculis felis eu, viverra urna.",
};

const faqEntries = [faqEntry_01, faqEntry_02, faqEntry_03];

export const testClimateOrg: Organization = {
  id: "1",
  name: "Berlin Climate Org",
  createdBy: testUser,
  status: 2,
  tagline: "Fighting Climate Change",
  location: "Berlin, Germany",
  getInvolvedURL: "/",
  description:
    "Nulla aliqua sit fugiat commodo excepteur deserunt dolor ullamco Lorem. Esse aliquip nisi ullamco pariatur velit officia. Eiusmod commodo nulla consequat minim laboris pariatur adipisicing. Veniam amet nostrud id cupidatat. Esse duis velit elit duis non labore adipisicing sunt eu nostrud. Occaecat mollit et do consectetur fugiat amet.",
  // topics: ["Environment"],
  // members: [testUser, testUser],
  // supportingUsers: [testUser, testUser],
  groups: ["Fundraising", "Campaigning"],
  socialLinks: ["climate-org@mastodon", "climate-org@email"],
  // donationPrompt: "Hey thanks!",
  faqEntries: faqEntries,
};

export const testTechGroup1: Group = {
  id: "1",
  name: "Code Night",
  createdBy: testUser,
  organization: testClimateOrg,
  tagline: "Let's code!",
  location: "Berlin",
  getInvolvedURL: "/",
  description: "This is the description of Code Night.",
  // topics: ["Technology and Privacy"],
  // members: [testUser, testUser, testUser],
  // supportingUsers: [testUser, testUser, testUser],
  faqEntries: faqEntries,
};

export const testTechGroup2: Group = {
  id: "2",
  name: "Code Brunch",
  createdBy: testUser,
  organization: testClimateOrg,
  tagline: "Let's code!",
  location: "Berlin",
  getInvolvedURL: "/",
  description: "This is the description of Code Night.",
  // topics: ["Technology and Privacy"],
  // members: [testUser, testUser, testUser],
  // supportingUsers: [testUser, testUser, testUser],
  faqEntries: faqEntries,
};

const testDiscussion: Discussion = {
  title: "Title of discussion ",
  createdBy: testUser,
  orgID: testClimateOrg.id,
  category: "Category",
  upVoters: [testUser, testUser],
  participants: [testUser, testUser],
  messages: 3,
  creationDate: new Date().toISOString().slice(0, 10),
};

export const testTechOrg: Organization = {
  id: "1",
  name: "tech from below",
  tagline: "Technologie von und für soziale Bewegungen",
  createdBy: testUser,
  status: 2,
  location: "Berlin, Germany",
  getInvolvedURL: "/",
  description:
    "Nulla aliqua sit fugiat commodo excepteur deserunt dolor ullamco Lorem. Esse aliquip nisi ullamco pariatur velit officia. Eiusmod commodo nulla consequat minim laboris pariatur adipisicing. Veniam amet nostrud id cupidatat. Esse duis velit elit duis non labore adipisicing sunt eu nostrud. Occaecat mollit et do consectetur fugiat amet.",
  // topics: ["Environment"],
  // members: [testUser, testUser],
  // supportingUsers: [testUser, testUser],
  iconURL: "/images/tech-from-below.svg",
  groups: [testTechGroup1, testTechGroup2],
  socialLinks: ["tfb@mastodon", "tfb@email"],
  // donationPrompt: "Hey thanks!",
  discussions: [testDiscussion, testDiscussion],
  faqEntries: faqEntries,
};

export const testClimateEvent: Event = {
  id: "1",
  name: "Brandenburg Gate Climate Demo",
  tagline: "There is no Planet B",
  createdBy: testUser,
  organizations: [testClimateOrg],
  type: "action",
  getInvolvedURL: "/",
  // topics: ["Environment"],
  description:
    "Aute aliqua reprehenderit ex ut commodo nostrud et excepteur. Sunt amet velit sunt fugiat et excepteur dolore pariatur nisi non. Exercitation aute aute culpa commodo commodo ea Lorem aliquip id duis. Laboris nostrud ullamco ea voluptate et anim id adipisicing sint reprehenderit incididunt elit. Est fugiat pariatur elit culpa in incididunt eu esse cupidatat minim. Deserunt duis culpa minim Lorem consectetur quis fugiat ipsum nostrud voluptate veniam do. Reprehenderit duis officia in enim anim elit.",
  getInvolved:
    "Sint cillum excepteur sint cupidatat do consectetur excepteur nisi veniam. Sint id in sit eiusmod Lorem commodo minim culpa id cupidatat consectetur. Labore nisi est officia sunt occaecat.",
  // attending: [user, user],
  offlineLocation: "Brandenburg Gate, Berlin",
  startTime: new Date().toISOString().slice(0, 10),
  // supportingUsers: [user, user],
  // iconURL: "/images/an_image.svg",
  socialLinks: ["climate_org@mastodon", "climate_org@email.com"],
};

export const testTechEvent: Event = {
  id: "1",
  name: "bimonthly tech meetup",
  tagline: "Let's fix some bugs!",
  createdBy: testUser,
  type: "action",
  organizations: [testTechOrg, testTechOrg],
  // topics: ["Hackathon"],
  description: "Let's fix some bugs!",
  getInvolved: "Squash some bugs!",
  offlineLocation: "Berlin",
  startTime: new Date().toLocaleDateString(),
  // supportingUsers: [user, user, user],
};

export const testResource: Resource = {
  id: "1",
  name: "Test Resource",
  createdBy: testUser,
  description: "Test resource :D",
  // category: "category",
  location: "Berlin",
  resourceURL: "http://www.test.com",
  // topics: ["Tools"],
  creationDate: new Date().toLocaleDateString(),
  // starers: [user, user],
  organization: testClimateOrg,
};
