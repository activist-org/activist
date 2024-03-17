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
    icon: "bi:globe",
    value: Topic.ACCESSIBILITY,
    label: `_global.topics.accessibility`,
  },
  {
    icon: "bi:globe",
    value: Topic.ANIMALS,
    label: `_global.topics.animal-rights`,
  },
  {
    icon: "bi:globe",
    value: Topic.CHILDREN,
    label: `_global.topics.children-rights`,
  },
  {
    icon: "bi:globe",
    value: Topic.DEMOCRACY,
    label: `_global.topics.democracy`,
  },
  {
    icon: "bi:globe",
    value: Topic.EDUCATION,
    label: `_global.topics.education`,
  },
  {
    icon: "bi:globe",
    value: Topic.ELDERS,
    label: `_global.topics.elders`,
  },
  {
    icon: "bi:globe",
    value: Topic.EMERGENCY_RELIEF,
    label: `_global.topics.emergency-relief`,
  },
  {
    icon: "bi:globe",
    value: Topic.ENVIRONMENT,
    label: `_global.topics.environment`,
  },
  {
    icon: "bi:globe",
    value: Topic.EXPRESSION,
    label: `_global.topics.expression`,
  },
  {
    icon: "bi:globe",
    value: Topic.HEALTH,
    label: `_global.topics.health`,
  },
  {
    icon: "bi:globe",
    value: Topic.HOUSING,
    label: `_global.topics.housing`,
  },
  {
    icon: "bi:globe",
    value: Topic.LABOR,
    label: `_global.topics.labor`,
  },
  {
    icon: "bi:globe",
    value: Topic.LGTBQIA,
    label: `_global.topics.lgbtqia`,
  },
  {
    icon: "bi:globe",
    value: Topic.MIGRATION,
    label: `_global.topics.migration`,
  },
  {
    icon: "bi:globe",
    value: Topic.MOBILITY,
    label: `_global.topics.mobility`,
  },
  {
    icon: "bi:globe",
    value: Topic.NUTRITION,
    label: `_global.topics.nutrition`,
  },
  {
    icon: "bi:globe",
    value: Topic.PEACE_RESOLUTION,
    label: `_global.topics.peace-resolution`,
  },
  {
    icon: "bi:globe",
    value: Topic.RACIAL_JUSTICE,
    label: `_global.topics.racial-justice`,
  },
  {
    icon: "bi:globe",
    value: Topic.TECHNOLOGY_PRIVACY,
    label: `_global.topics.technology-privacy`,
  },
  {
    icon: "bi:globe",
    value: Topic.TRANSPARENCY,
    label: `_global.topics.transparency`,
  },
  {
    icon: "bi:globe",
    value: Topic.WOMEN,
    label: `_global.topics.women`,
  },
];
