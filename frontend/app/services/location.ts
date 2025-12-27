export const searchLocationNomatim = async (filters: Record<string, string>) => {
  const nominatimBaseUrl = "https://nominatim.openstreetmap.org/search";
  try {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      query.append(key, String(value));
    });
    const url = `${nominatimBaseUrl}?${query}&format=jsonv2&limit=5`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    const err = errorHandler(error);
    throw err;
  }
}
