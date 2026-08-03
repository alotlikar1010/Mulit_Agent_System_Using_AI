import api from "../utils/axios"

export const getMessages = async (id) => {
    try {
        const { data } = await api.get(`/api/chat/get-messages/${id}`)
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}
