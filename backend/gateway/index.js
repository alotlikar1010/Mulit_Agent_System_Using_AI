import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
// import morgan from "morgan";
// import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser());
app.use("/auth", proxy(process.env.AUTH_SERVICE))

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Gateway started at Port ${PORT}`);
});