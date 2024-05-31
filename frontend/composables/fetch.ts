

export const fetchWithToken = async (url: string) => {
    const token = localStorage.getItem('accessToken')

    const res = await $fetch.raw(url, {
        headers: {
            Authorization: `Token ${token}`
        }
    })
    
    return res._data
}