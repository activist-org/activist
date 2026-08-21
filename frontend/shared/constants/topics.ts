// SPDX-License-Identifier: AGPL-3.0-or-later
import { IconMap } from "./iconMap";

export const TopicType = {
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
    topic: TopicType.ACCESSIBILITY,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.animal_rights",
    topic: TopicType.ANIMAL_RIGHTS,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.democracy_and_governance",
    topic: TopicType.DEMOCRACY_AND_GOVERNANCE,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.education",
    topic: TopicType.EDUCATION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.emergency_relief",
    topic: TopicType.EMERGENCY_RELIEF,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.environment",
    topic: TopicType.ENVIRONMENT,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.health",
    topic: TopicType.HEALTH,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.housing",
    topic: TopicType.HOUSING,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.labor_rights",
    topic: TopicType.LABOR_RIGHTS,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.lgbtqia",
    topic: TopicType.LGBTQIA,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.peace_and_resolution",
    topic: TopicType.PEACE_AND_RESOLUTION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.racial_justice",
    topic: TopicType.RACIAL_JUSTICE,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.refugees_and_migration",
    topic: TopicType.REFUGEES_AND_MIGRATION,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.technology_privacy",
    topic: TopicType.TECHNOLOGY_AND_PRIVACY,
  },
  {
    icon: `${IconMap.GLOBE}`,
    description: "",
    label: "i18n.constants.topics.womens_rights",
    topic: TopicType.WOMENS_RIGHTS,
  },
];
