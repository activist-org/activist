export const fetchWithToken = async (
  url: string,
  data: object | {} | undefined
) => {
  const token = localStorage.getItem("accessToken");

  const res = await $fetch.raw(BASE_BACKEND_URL + url, {
    data,
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  return res._data;
};
