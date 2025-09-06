// SPDX-License-Identifier: AGPL-3.0-or-later

import { IconMap } from "~/types/icon-map";

export enum TopicOption {
  ACCESSIBILITY = "ACCESSIBILITY",
  ANIMAL_RIGHTS = "ANIMAL_RIGHTS",
  DEMOCRACY_AND_GOVERNANCE = "DEMOCRACY_AND_GOVERNANCE",
  EDUCATION = "EDUCATION",
  EMERGENCY_RELIEF = "EMERGENCY_RELIEF",
  ENVIRONMENT = "ENVIRONMENT",
  HEALTH = "HEALTH",
  HOUSING = "HOUSING",
  LABOR_RIGHTS = "LABOR_RIGHTS",
  LGTBQIA = "LGTBQIA",
  PEACE_AND_RESOLUTION = "PEACE_AND_RESOLUTION",
  RACIAL_JUSTICE = "RACIAL_JUSTICE",
  REFUGEES_AND_MIGRATION = "REFUGEES_AND_MIGRATION",
  TECHNOLOGY_AND_PRIVACY = "TECHNOLOGY_AND_PRIVACY",
  WOMENS_RIGHTS = "WOMENS_RIGHTS",
}

export interface Topic {
  constant: string;
  active: boolean;
  creation_date: Date;
  last_updated: Date;
  deprecation_date?: Date;
}

export interface TopicTag {
  icon: string;
  description: string;
  label: string;
  topic: TopicOption;
}

export const GLOBAL_TOPICS: TopicTag[] = [
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.accessibility",
    topic: TopicOption.ACCESSIBILITY,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.animal_rights",
    topic: TopicOption.ANIMAL_RIGHTS,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.democracy_and_governance",
    topic: TopicOption.DEMOCRACY_AND_GOVERNANCE,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.education",
    topic: TopicOption.EDUCATION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.emergency_relief",
    topic: TopicOption.EMERGENCY_RELIEF,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.environment",
    topic: TopicOption.ENVIRONMENT,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.health",
    topic: TopicOption.HEALTH,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.housing",
    topic: TopicOption.HOUSING,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.labor_rights",
    topic: TopicOption.LABOR_RIGHTS,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.lgbtqia",
    topic: TopicOption.LGTBQIA,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.peace_and_resolution",
    topic: TopicOption.PEACE_AND_RESOLUTION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.racial_justice",
    topic: TopicOption.RACIAL_JUSTICE,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.refugees_and_migration",
    topic: TopicOption.REFUGEES_AND_MIGRATION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.technology_privacy",
    topic: TopicOption.TECHNOLOGY_AND_PRIVACY,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.womens_rights",
    topic: TopicOption.WOMENS_RIGHTS,
  },
];

// MARK: Pinia Responses

export interface TopicsResponseBody {
  count: number;
  next: number | null;
  previous: number | null;
  results: Topic[];
}
