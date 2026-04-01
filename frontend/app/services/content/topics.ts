// SPDX-License-Identifier: AGPL-3.0-or-later
import { get } from "~/services/http";

// MARK: Map API Response to Type

/**
 * Maps the raw API response for topics to the Topic type used in the frontend, ensuring that all fields are properly handled and formatted. The function takes an array of Topic objects from the API response and returns a new array of Topic objects with the same properties, allowing for any necessary transformations or default values to be applied as needed.
 * @param res An array of Topic objects received from the API response, containing the raw data for each topic.
 * @returns An array of Topic objects formatted according to the frontend's Topic type, with all fields properly handled and any necessary transformations applied.
 */
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

// MARK: Get All

/**
 * Fetches a list of topics from the backend API by sending a GET request to the /content/topics endpoint. The function uses the get helper for making HTTP requests and the errorHandler for consistent error handling across the application. The response from the API is mapped to an array of Topic objects using the mapTopics function before being returned.
 * @returns A Promise that resolves to an array of Topic objects containing the details of each topic fetched from the API.
 * @throws {AppError} if the API request fails or if there is an error during the mapping of the response.
 */
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
