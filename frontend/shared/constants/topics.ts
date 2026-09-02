// SPDX-License-Identifier: AGPL-3.0-or-later
import { IconMap } from "./iconMap";

export const TopicMap = {
  ACCESSIBILITY: "ACCESSIBILITY",
  ANIMAL_RIGHTS: "ANIMAL_RIGHTS",
  DEMOCRACY_AND_GOVERNANCE: "DEMOCRACY_AND_GOVERNANCE",
  EDUCATION: "EDUCATION",
  EMERGENCY_RELIEF: "EMERGENCY_RELIEF",
  ENVIRONMENT: "ENVIRONMENT",
  HEALTH: "HEALTH",
  HOUSING: "HOUSING",
  LABOR_RIGHTS: "LABOR_RIGHTS",
  LGBTQIA: "LGBTQIA",
  PEACE_AND_RESOLUTION: "PEACE_AND_RESOLUTION",
  RACIAL_JUSTICE: "RACIAL_JUSTICE",
  REFUGEES_AND_MIGRATION: "REFUGEES_AND_MIGRATION",
  TECHNOLOGY_AND_PRIVACY: "TECHNOLOGY_AND_PRIVACY",
  WOMENS_RIGHTS: "WOMENS_RIGHTS",
} as const;

export const GLOBAL_TOPICS = [
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.accessibility_and_inclusion",
    topic: TopicMap.ACCESSIBILITY,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.animal_rights",
    topic: TopicMap.ANIMAL_RIGHTS,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.democracy_and_governance",
    topic: TopicMap.DEMOCRACY_AND_GOVERNANCE,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.education",
    topic: TopicMap.EDUCATION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.emergency_relief",
    topic: TopicMap.EMERGENCY_RELIEF,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.environment",
    topic: TopicMap.ENVIRONMENT,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.health",
    topic: TopicMap.HEALTH,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.housing",
    topic: TopicMap.HOUSING,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.labor_rights",
    topic: TopicMap.LABOR_RIGHTS,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.lgbtqia",
    topic: TopicMap.LGBTQIA,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.peace_and_resolution",
    topic: TopicMap.PEACE_AND_RESOLUTION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.racial_justice",
    topic: TopicMap.RACIAL_JUSTICE,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.refugees_and_migration",
    topic: TopicMap.REFUGEES_AND_MIGRATION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.technology_privacy",
    topic: TopicMap.TECHNOLOGY_AND_PRIVACY,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.womens_rights",
    topic: TopicMap.WOMENS_RIGHTS,
  },
];
