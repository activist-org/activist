// SPDX-License-Identifier: AGPL-3.0-or-later

import { IconMap } from "~/types/icon-map";

export enum Topic {
  ACCESSIBILITY = "accessibility",
  ANIMALS = "animal rights",
  CHILDREN = "children's rights",
  DEMOCRACY = "democracy",
  EDUCATION = "education",
  ELDERS = "elder rights",
  EMERGENCY_RELIEF = "emergency relief",
  ENVIRONMENT = "environment",
  EXPRESSION = "freedom of expression",
  HEALTH = "health",
  HOUSING = "housing",
  LABOR = "labor rights",
  LGTBQIA = "lgbtqi+",
  MIGRATION = "migration",
  MOBILITY = "mobility",
  NUTRITION = "nutrition",
  PEACE_RESOLUTION = "peace and resolution",
  RACIAL_JUSTICE = "racial justice",
  TECHNOLOGY_PRIVACY = "technology and privacy",
  TRANSPARENCY = "transparency",
  WOMEN = "women's rights",
}

export interface TopicsTag {
  label: string;
  icon: string;
  value: Topic;
}

export const GLOBAL_TOPICS: TopicsTag[] = [
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.ACCESSIBILITY,
    label: "i18n.types.topics.accessibility",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.ANIMALS,
    label: "i18n.types.topics.animal_rights",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.CHILDREN,
    label: "i18n.types.topics.children_rights",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.DEMOCRACY,
    label: "i18n.types.topics.democracy",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.EDUCATION,
    label: "i18n.types.topics.education",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.ELDERS,
    label: "i18n.types.topics.elders",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.EMERGENCY_RELIEF,
    label: "i18n.types.topics.emergency_relief",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.ENVIRONMENT,
    label: "i18n.types.topics.environment",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.EXPRESSION,
    label: "i18n.types.topics.expression",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.HEALTH,
    label: "i18n.types.topics.health",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.HOUSING,
    label: "i18n.types.topics.housing",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.LABOR,
    label: "i18n.types.topics.labor",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.LGTBQIA,
    label: "i18n.types.topics.lgbtqia",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.MIGRATION,
    label: "i18n.types.topics.migration",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.MOBILITY,
    label: "i18n.types.topics.mobility",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.NUTRITION,
    label: "i18n.types.topics.nutrition",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.PEACE_RESOLUTION,
    label: "i18n.types.topics.peace_resolution",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.RACIAL_JUSTICE,
    label: "i18n.types.topics.racial_justice",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.TECHNOLOGY_PRIVACY,
    label: "i18n.types.topics.technology_privacy",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.TRANSPARENCY,
    label: "i18n.types.topics.transparency",
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.WOMEN,
    label: "i18n.types.topics.women",
  },
];
