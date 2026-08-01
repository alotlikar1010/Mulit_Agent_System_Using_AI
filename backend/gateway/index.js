import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
// import morgan from "morgan";
// import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controllers/user.controller.js";
import { protect } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser());
app.use("/api/auth", proxy(process.env.AUTH_SERVICE))
app.use("/api/chat", protect, proxy(process.env.CHAT_SERVICE))
app.use("/api/agent", protect, proxy(process.env.AGENT_SERVICE))
app.get("/api/me", protect, getCurrentUser)

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Gateway started at Port ${PORT}`);
});