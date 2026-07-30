import { ChatGroq } from "@langchain/groq"

const groq = new ChatGroq({
    model: "groq/llama3.1-8b-instant",
    // apiKey: process.env.GROQ_API_KEY,

})

export const getModel = async (agent) => {

    if (agent == "chat")
        return groq
    else if (agent == "search")
        return groq
    else
        return groq
}