// SPDX-License-Identifier: AGPL-3.0-or-later
// Organizations services.
// Uses services/http.ts helpers and centralizes error handling + normalization.

// MARK: Map API Response to Type

/**
 * Maps the raw API response for an organization to the Organization type used in the frontend, ensuring that all fields are properly handled and formatted. The function takes an OrganizationResponse object from the API response and returns a new Organization object with the same properties, allowing for any necessary transformations or default values to be applied as needed.
 * @param res An OrganizationResponse object received from the API response, containing the raw data for the organization.
 * @returns An Organization object formatted according to the frontend's Organization type, with all fields properly handled and any necessary transformations applied.
 */
export function mapOrganization(res: OrganizationResponse): Organization {
  return {
    id: res.id,
    orgName: res.orgName,
    name: res.name,
    tagline: res.tagline,
    createdBy: res.createdBy,
    iconUrl: res.iconUrl,
    location: res.location,
    socialLinks: res.socialLinks ?? [],
    status: res.status,
    creationDate: res.creationDate,
    images: res.images ?? [],
    groups: res.groups ?? [],
    events: res.events ?? [],
    resources: res.resources ?? [],
    faqEntries: res.faqEntries ?? [],
    texts: res.texts ?? [],
  };
}

// MARK: Get by ID

/**
 * Fetches the details of a specific organization by sending a GET request to the backend API with the unique identifier of the organization. The function uses the get helper for making HTTP requests and the errorHandler for consistent error handling across the application. The response from the API is mapped to an Organization object using the mapOrganization function before being returned.
 * @param id The unique identifier of the organization to be retrieved.
 * @returns A Promise that resolves to an Organization object formatted according to the frontend's Organization type.
 * @throws {AppError} if the API request fails or if there is an error during the retrieval process.
 */
export async function getOrganization(id: string): Promise<Organization> {
  try {
    const res = await get<OrganizationResponse>(
      `/communities/organizations/${id}`,
      { withoutAuth: true }
    );
    return mapOrganization(res);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: List by User ID

/**
 * Fetches a paginated list of organizations associated with a specific user by sending a GET request to the backend API with the unique identifier of the user, along with pagination parameters and optional filters. The function uses the get helper for making HTTP requests and the errorHandler for consistent error handling across the application. The response from the API is mapped to an array of Organization objects using the mapOrganization function before being returned, along with a flag indicating whether the current page is the last page of results.
 * @param userId The unique identifier of the user for whom the organizations are being retrieved.
 * @param page The page number for pagination, indicating which page of results to retrieve.
 * @param filters Optional filters to apply when retrieving the organizations, such as filtering by topics or other criteria.
 * @returns A Promise that resolves to an object containing an array of Organization objects formatted according to the frontend's Organization type and a boolean flag indicating whether the current page is the last page of results.
 * @throws {AppError} if the API request fails or if there is an error during the retrieval process.
 */
export async function listOrganizationsByUserId(
  userId: string,
  page: number,
  filters?: OrganizationFilters
): Promise<OrganizationPaginatedResponse> {
  try {
    const query = new URLSearchParams();
    if (filters) {
      // Handle topics specially: arrays become repeated params (?topics=A&topics=B).
      const { topics, ...rest } = filters ?? {};
      if (topics) {
        topics.forEach((t) => {
          if (!t) return;
          query.append("topics", String(t));
        });
      }
      // Add the remaining filters as single query params.
      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        query.append(key, String(value));
      });
    }
    const res = await get<OrganizationsResponseBody>(
      `/communities/organizations_by_user/${userId}?page=${page}${filters ? `&${query.toString()}` : ""}`
    );
    return { data: res.results.map(mapOrganization), isLastPage: !res.next };
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Create

/**
 * Creates a new organization by sending a POST request to the backend API with the provided organization data, including the organization's name, tagline, location, and associated topics. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application. The response from the API is mapped to an Organization object using the mapOrganization function before being returned.
 * @param data The data for the organization to be created, including the organization's name, tagline, location, and associated topics.
 * @returns A Promise that resolves to an Organization object representing the newly created organization, formatted according to the frontend's Organization type.
 * @throws {AppError} if the API request fails or if there is an error during the creation process.
 */
export async function createOrganization(
  data: CreateOrganizationInput
): Promise<Organization> {
  try {
    const res = await post<OrganizationResponse, typeof data>(
      `/communities/organizations`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return mapOrganization(res);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: List All

/**
 * Fetches a paginated list of all organizations by sending a GET request to the backend API with pagination parameters and optional filters. The function uses the get helper for making HTTP requests and the errorHandler for consistent error handling across the application. The response from the API is mapped to an array of Organization objects using the mapOrganization function before being returned, along with a flag indicating whether the current page is the last page of results.
 * @param filters Optional filters to apply when retrieving the organizations, such as filtering by topics or other criteria, along with pagination parameters like page number and page size.
 * @returns A Promise that resolves to an object containing an array of Organization objects formatted according to the frontend's Organization type and a boolean flag indicating whether the current page is the last page of results.
 * @throws {AppError} if the API request fails or if there is an error during the retrieval process.
 */
export async function listOrganizations(
  filters: OrganizationFilters & Pagination = { page: 1, page_size: 10 }
): Promise<OrganizationPaginatedResponse> {
  try {
    const query = new URLSearchParams();
    // Handle topics specially: arrays become repeated params (?topics=A&topics=B).
    const { topics, ...rest } = filters;
    if (topics) {
      topics.forEach((t) => {
        if (!t) return;
        query.append("topics", String(t));
      });
    }
    // Add the remaining filters as single query params.
    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      query.append(key, String(value));
    });
    const res = await get<OrganizationsResponseBody>(
      `/communities/organizations?${query.toString()}`,
      { withoutAuth: true }
    );
    return { data: res.results.map(mapOrganization), isLastPage: !res.next };
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Delete

/**
 * Deletes an existing organization by sending a DELETE request to the backend API with the unique identifier of the organization. The function uses the del helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param orgId The unique identifier of the organization to be deleted.
 * @returns A Promise that resolves when the organization has been successfully deleted in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteOrganization(orgId: string): Promise<void> {
  try {
    await del(`/communities/organizations/${orgId}`);
  } catch (e) {
    throw errorHandler(e);
  }
}
