import { ChatGroq } from "@langchain/groq"
import { ChatOpenRouter } from "@langchain/openrouter";
const groq = new ChatGroq({
    model: "groq/llama3.1-8b-instant",
    // apiKey: process.env.GROQ_API_KEY,

})

const openrouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 1024
});


export const getModel = async (agent) => {

    if (agent == "chat")
        return groq
    else if (agent == "search")
        return groq
    else if (agent == "coding")
        return openrouter
    else
        return groq
}