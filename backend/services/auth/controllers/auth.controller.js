import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
export const login = async (req, res) => {
    try {
        const { token } = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        console.log(decoded)
        const user = await User.findOne({ firebaseUid: decoded.uid })
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()
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

// export const register = async (req, res) => {
//     try {

//         const { email, password } = req.body

//         const user = await User.findOne({ email })
//         if (user) {
//             return res.status(404).json({ message: "User already exist" })
//         }

//         const newUser = new User({ email, password })
//         await newUser.save()

//         const token = generateToken(newUser._id)
//         res.status(200).json({ token })
//     }
//     catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "Internal server error" })
//     }
// }
