// SPDX-License-Identifier: AGPL-3.0-or-later
// Groups service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import { get } from "~/services/http";

// MARK: Map API Response to Type

/**
 * Maps the raw API response for a group to the Group type used in the frontend application. This function takes the raw response data from the backend API, which may include additional fields or have a different structure, and transforms it into a consistent format that matches the Group type defined in the frontend codebase. The mapping process includes extracting relevant fields, handling optional values, and ensuring that the resulting Group object contains all necessary information for use in the frontend application.
 * @param res The raw API response for a group, which may include additional fields or have a different structure than the Group type used in the frontend application.
 * @returns A Group object that has been mapped from the raw API response, containing all relevant fields and formatted according to the Group type definition in the frontend codebase.
 */
export function mapGroup(res: GroupResponse): Group {
  return {
    id: res.id,
    images: res.images ?? [],
    groupName: res.groupName,
    name: res.name,
    tagline: res.tagline,
    org: res.org,
    createdBy: res.createdBy,
    iconUrl: res.iconUrl,
    location: res.location,
    socialLinks: res.socialLinks,
    creationDate: res.creationDate,
    events: res.events ?? [],
    resources: res.resources ?? [],
    faqEntries: res.faqEntries ?? [],
    texts: res.texts ?? [],
  };
}

// MARK: Get Group by ID

/**
 *  Fetches the details of a specific group by sending a GET request to the backend API with the unique identifier of the group. The function uses the get helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function maps the raw response data to the Group type used in the frontend application using the mapGroup function, ensuring that the resulting Group object contains all relevant fields and is formatted according to the Group type definition in the frontend codebase.
 * @param id The unique identifier of the group to be fetched from the backend API.
 * @returns A Promise that resolves to a Group object containing the details of the specified group, mapped from the raw API response using the mapGroup function.
 * @throws {AppError} if the API request fails or if there is an error during the fetching process.
 */
export async function getGroup(id: string): Promise<Group> {
  try {
    const res = await get<GroupResponse>(`/communities/groups/${id}`, {
      withoutAuth: true,
    });
    return mapGroup(res);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: List All Groups

/**
 * Fetches a paginated list of groups from the backend API based on the provided filters and pagination parameters. The function sends a GET request to the backend API with the appropriate query parameters for filtering and pagination, and uses the get helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function maps each raw group data in the response to the Group type used in the frontend application using the mapGroup function, ensuring that each resulting Group object contains all relevant fields and is formatted according to the Group type definition in the frontend codebase. The function returns a paginated response containing an array of Group objects and a boolean indicating whether there are more pages of results available.
 * @param filters The filters and pagination parameters to be applied when fetching the list of groups from the backend API, including page number, page size, and any additional filtering criteria defined in the GroupFilters type.
 * @returns A Promise that resolves to a GroupPaginatedResponse object containing an array of Group objects that match the specified filters and pagination parameters, and a boolean indicating whether there are more pages of results available. Each Group object in the array is mapped from the raw API response using the mapGroup function.
 * @throws {AppError} if the API request fails or if there is an error during the fetching process.
 */
export async function listGroups(
  filters: GroupFilters & Pagination = { page: 1, page_size: 10 }
): Promise<GroupPaginatedResponse> {
  try {
    const query = new URLSearchParams();
    // Handle linked_organizations specially: arrays become repeated params (?linked_organizations=A&linked_organizations=B).
    const { linked_organizations, ...rest } = filters;
    if (linked_organizations) {
      linked_organizations.forEach((t) => {
        if (!t) return;
        query.append("linked_organizations", String(t));
      });
    }
    // Add the remaining filters as single query params.
    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      query.append(key, String(value));
    });
    const res = await get<GroupsResponseBody>(
      `/communities/groups?${query.toString()}`,
      { withoutAuth: true }
    );
    return {
      data: res.results.map(mapGroup),
      isLastPage: !res.next,
    };
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Create

/**
 * Creates a new group by sending a POST request to the backend API with the provided group data. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function maps the raw response data to the Group type used in the frontend application using the mapGroup function, ensuring that the resulting Group object contains all relevant fields and is formatted according to the Group type definition in the frontend codebase.
 * @param data The data for the group to be created, including all required fields defined in the CreateGroupInput type.
 * @returns A Promise that resolves to a Group object containing the details of the newly created group, mapped from the raw API response using the mapGroup function.
 * @throws {AppError} if the API request fails or if there is an error during the creation process.
 */
export async function createGroup(data: CreateGroupInput): Promise<Group> {
  try {
    const res = await post<GroupResponse, typeof data>(
      `/communities/groups`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return mapGroup(res);
  } catch (e) {
    throw errorHandler(e);
  }
}
