import { getModel } from "../config/llmModels"

export const chatAgent = async (state) => {

    const llm = await getModel("chat");
    const sysprompt = "You are a GeminisAI, an intelligent AI assistant"
    const response = await llm.invoke([
        { "role": "system", "content": sysprompt },
        { "role": "human", "content": state.prompt }
    ])

    const aiResponse = response.content
    return {
        ...state,
        aiResponse
    }
}