// SPDX-License-Identifier: AGPL-3.0-or-later
export interface Topic {
  type: TopicMapType;
  active: boolean;
  creation_date: Date;
  last_updated: Date;
  deprecation_date?: Date;
  id: string;
}

export interface TopicTag {
  icon: string;
  description: string;
  label: string;
  topic: TopicMapType;
}

// MARK: Pinia Responses

export interface TopicsResponseBody {
  count: number;
  next: number | null;
  previous: number | null;
  results: Topic[];
}
