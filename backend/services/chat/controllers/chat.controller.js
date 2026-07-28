export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const conversation = await Conversation.create({
            userId: userId
        })
        return res.status(200).json(conversation)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: " createConversation Internal server error" })
    }
}


export const getConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        const conversation = await Conversation.find({
            userId: userId
        }).sort({ updatedAt: -1 })
        return res.status(200).json(conversation)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: " getConversation Internal server error" })
    }
}

export const updateConversation = async (req, res) => {
    try {
        const { id, title } = req.body
        const conversation = await Conversation.findByIdAndUpdate(id, {
            title: title
        })
        return res.status(200).json(conversation)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: " updateConversation Internal server error" })
    }
}




export const saveMessage = async (req, res) => {

    try {
        const { conversationId, role, content } = req.body
        const message = await Message.create({
            conversationId: conversationId,
            role: role,
            content: content
        })
        return res.status(200).json(message)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: " saveMessage Internal server error" })
    }
}


export const getMessage = async (req, res) => {

    try {
        const message = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ updatedAt: -1 })

        return res.status(200).json(message)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: " getMessage Internal server error" })
    }
}
