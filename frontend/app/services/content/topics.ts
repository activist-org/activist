import type { Topic } from "~/types/content/topics";

import { get } from "~/services/http";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Map API Response to Type

export function mapTopics(res: Topic[]): Topic[] {
  return res.map((topic) => ({
    type: topic.type,
    active: topic.active,
    creation_date: topic.creation_date,
    last_updated: topic.last_updated,
    deprecation_date: topic.deprecation_date,
    id: topic.id,
  }));
}

// MARK: Get All Topics

export async function listTopics(): Promise<Topic[]> {
  try {
    const res = await get<Topic[]>(`/content/topics`, {
      withoutAuth: true,
    });
    return mapTopics(res);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
