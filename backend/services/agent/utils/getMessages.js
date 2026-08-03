import axios from "axios"
export const getMessages = async (conversationId) => {

    try {
        const { data } = await axios.get(`${process.env.CHAT_SERVICES}/get-messages/${conversationId}`);
        return data;
    }
    catch (error) {
        console.log(error);
    }

}