import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
import User from "../models/user.modal.js"
import redis from "../../../shared/redis/redis.js"
export const login = async (req, res) => {
    try {
        const { token } = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        console.log(decoded)
        let user = await User.findOne({ firebaseUid: decoded.uid })
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()

        await redis.set(`session:${sessionId}`, JSON.stringify({
            userId: user._id,
            email: user.email,
            avatar: user.avatar
        }), "EX", 7 * 24 * 60 * 60)

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({ user })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies?.session
        await redis.del(`session:${sessionId}`)
        res.clearCookie("session")
        res.status(200).json({ message: "User logged out" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateUserPayment = async (req, res) =>{
    try{
        const {plan, credits, UserId } = req.body
        const user = await User.findById(UserId)
        if (!user){
                return res.status(404).json({message:"User not found"})
        }
        user.plan = plan
        user.credits+=credits
        user.totalCredits+=credits
        user.planExpiresAt = new Date(Date.now() + 30 *24*60*60*1000)
        await user.save()

        const sessionId = await redis.get(`user-session-${user?._id}`)
        console.log("sessionId", sessionId)
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)

        return res.status(200).json({ success: true })
    }
    catch (error){
        res.status(500).json({ message: "updateUserPayment server error" })
    }
}