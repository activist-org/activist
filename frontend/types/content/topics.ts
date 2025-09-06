// SPDX-License-Identifier: AGPL-3.0-or-later

import { IconMap } from "~/types/icon-map";

export enum TopicEnum {
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
  topic: TopicEnum;
}

export const GLOBAL_TOPICS: TopicTag[] = [
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.accessibility_and_inclusion",
    topic: TopicEnum.ACCESSIBILITY,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.animal_rights",
    topic: TopicEnum.ANIMAL_RIGHTS,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.democracy_and_governance",
    topic: TopicEnum.DEMOCRACY_AND_GOVERNANCE,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.education",
    topic: TopicEnum.EDUCATION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.emergency_relief",
    topic: TopicEnum.EMERGENCY_RELIEF,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.environment",
    topic: TopicEnum.ENVIRONMENT,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.health",
    topic: TopicEnum.HEALTH,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.housing",
    topic: TopicEnum.HOUSING,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.labor_rights",
    topic: TopicEnum.LABOR_RIGHTS,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.lgbtqia",
    topic: TopicEnum.LGTBQIA,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.peace_and_resolution",
    topic: TopicEnum.PEACE_AND_RESOLUTION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.racial_justice",
    topic: TopicEnum.RACIAL_JUSTICE,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.refugees_and_migration",
    topic: TopicEnum.REFUGEES_AND_MIGRATION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.technology_privacy",
    topic: TopicEnum.TECHNOLOGY_AND_PRIVACY,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.types.content.topics.womens_rights",
    topic: TopicEnum.WOMENS_RIGHTS,
  },
];

// MARK: Pinia Responses

export interface TopicsResponseBody {
  count: number;
  next: number | null;
  previous: number | null;
  results: Topic[];
}
