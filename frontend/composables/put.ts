// SPDX-License-Identifier: AGPL-3.0-or-later
export const putWithToken = async (url: string, data: object | undefined) => {
  const { getToken } = useToken();
  const token = await  getToken();

  if (data !== undefined) {
    const res = await $fetch.raw(BASE_BACKEND_URL + url, {
      method: "PUT",
      body: JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(data as { value: any }).value,
      }),
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return res._data;
  }
};
