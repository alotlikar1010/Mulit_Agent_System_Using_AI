import { getModel } from "../config/llmModels"

export const chatAgent = async (state) => {

    const llm = getModel("chat");
    const prompt = "this is test"
    const response = (await llm).invoke()

}