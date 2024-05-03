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
    label: `_global.topics.accessibility`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.ANIMALS,
    label: `_global.topics.animal-rights`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.CHILDREN,
    label: `_global.topics.children-rights`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.DEMOCRACY,
    label: `_global.topics.democracy`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.EDUCATION,
    label: `_global.topics.education`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.ELDERS,
    label: `_global.topics.elders`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.EMERGENCY_RELIEF,
    label: `_global.topics.emergency-relief`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.ENVIRONMENT,
    label: `_global.topics.environment`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.EXPRESSION,
    label: `_global.topics.expression`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.HEALTH,
    label: `_global.topics.health`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.HOUSING,
    label: `_global.topics.housing`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.LABOR,
    label: `_global.topics.labor`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.LGTBQIA,
    label: `_global.topics.lgbtqia`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.MIGRATION,
    label: `_global.topics.migration`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.MOBILITY,
    label: `_global.topics.mobility`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.NUTRITION,
    label: `_global.topics.nutrition`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.PEACE_RESOLUTION,
    label: `_global.topics.peace-resolution`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.RACIAL_JUSTICE,
    label: `_global.topics.racial-justice`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.TECHNOLOGY_PRIVACY,
    label: `_global.topics.technology-privacy`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.TRANSPARENCY,
    label: `_global.topics.transparency`,
  },
  {
    icon: `${IconMap.GLOBE}`,
    value: Topic.WOMEN,
    label: `_global.topics.women`,
  },
];
