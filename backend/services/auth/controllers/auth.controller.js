export const login = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = generateToken(user._id)
        res.status(200).json({ token })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const register = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (user) {
            return res.status(404).json({ message: "User already exist" })
        }

        const newUser = new User({ email, password })
        await newUser.save()

        const token = generateToken(newUser._id)
        res.status(200).json({ token })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
