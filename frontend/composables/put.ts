export const putWithToken = async (
  url: string,
  data: object | {} | undefined
) => {
  const token = localStorage.getItem("accessToken");

  if (data !== undefined) {
    const res = await $fetch.raw(BASE_BACKEND_URL + url, {
      method: "PUT",
      body: JSON.stringify({
        ...(data as { value: any }).value,
      }),
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return res._data;
  }
};
