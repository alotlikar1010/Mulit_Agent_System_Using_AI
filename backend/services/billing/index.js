import express from "express";
import dotenv from "dotenv";
import router from "./routes/billing.route.js"
import connectDB from "./config/db.js"
// import morgan from "morgan";
// import mongoose from "mongoose";
// import cors from "cors";
dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();

const app = express();
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Billing started at Port ${PORT}`);
});