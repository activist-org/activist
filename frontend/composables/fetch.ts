/**
 * Returns data given the authentication status of the user.
 * @param url Backend URL to make the request to.
 * @param data Data to be returned.
 * @returns The resulting data from the table.
 */
export const fetchWithOptionalToken = async (
  url: string,
  data: object | {} | undefined
) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    const res = await $fetch.raw(BASE_BACKEND_URL + url, {
      data,
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return res._data;
  } else {
    const res = await $fetch.raw(BASE_BACKEND_URL + url, {
      data,
      headers: {},
    });

    return res._data;
  }
};
