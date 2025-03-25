// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Returns data given the authentication status of the user.
 * @param url Backend URL to make the request to.
 * @param data Data to be returned.
 * @returns The resulting data from the table.
 */

export const fetchWithoutToken = async (
  url: string,
  data: object | undefined
) => {
  const res = await $fetch.raw(BASE_BACKEND_URL + url, {
    data,
    headers: {},
  });

  return res._data;
};

export const fetchWithOptionalToken = async (
  url: string,
  data: object | undefined
) => {
  const { getToken } = useToken();
  const token = await  getToken();

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
