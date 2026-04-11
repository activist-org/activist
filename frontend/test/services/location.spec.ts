// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it, vi } from "vitest";

import { searchLocationNomatim } from "../../app/services/location"; // Adjust path if needed

// If errorHandler is auto-imported or imported directly in your service,
// we ensure it's available or we can just assert on the standard Error throwing.
describe("services/location", () => {
  let fetchMock: unknown;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  // MARK: API Fetching

  it("searchLocationNomatim() builds the correct URL and query string", async () => {
    const mockResponse = [{ place_id: 1, display_name: "Paris" }];
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const filters = { city: "Paris", country: "France" };
    const result = await searchLocationNomatim(filters);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Check if the URL was constructed correctly with all params.
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain("https://nominatim.openstreetmap.org/search?");
    expect(calledUrl).toContain("city=Paris");
    expect(calledUrl).toContain("country=France");
    expect(calledUrl).toContain("format=jsonv2");
    expect(calledUrl).toContain("limit=5");

    expect(result).toEqual(mockResponse);
  });

  it("searchLocationNomatim() ignores null and undefined filter values", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const filters = { city: "London", state: null, country: undefined };
    await searchLocationNomatim(filters);

    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain("city=London");
    expect(calledUrl).not.toContain("state");
    expect(calledUrl).not.toContain("country");
    expect(calledUrl).not.toContain("null");
    expect(calledUrl).not.toContain("undefined");
  });

  // MARK: Error Handling

  it("throws an error if the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    // We expect it to reject. If your errorHandler wraps it in AppError,
    // it will be an instance of Error/AppError.
    await expect(searchLocationNomatim({ city: "Berlin" })).rejects.toThrow();
  });

  it("propagates network errors correctly", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network failure"));

    await expect(searchLocationNomatim({ city: "Berlin" })).rejects.toThrow();
  });
});
