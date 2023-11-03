export enum Topic {
  JUSTICE = "justice",
  ACTIVISM = "activism",
  EDUCATION = "education",
  ENVIRONMENT = "environment",
}

export interface TopicsTag {
  label: string;
  icon: string;
  value: Topic;
}

export const GLOBAL_TOPICS: TopicsTag[] = [
  {
    icon: "material-symbols:volunteer-activism",
    value: Topic.ACTIVISM,
    label: `global.topics.${Topic.ACTIVISM}`,
  },
  {
    icon: "mdi:justice",
    value: Topic.JUSTICE,
    label: `global.topics.${Topic.JUSTICE}`,
  },
  {
    icon: "mdi:environment",
    value: Topic.ENVIRONMENT,
    label: `global.topics.${Topic.ENVIRONMENT}`,
  },
  {
    icon: "bi:book",
    value: Topic.EDUCATION,
    label: `global.topics.${Topic.EDUCATION}`,
  },
];