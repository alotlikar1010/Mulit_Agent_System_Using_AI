import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"

dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();

const app = express();
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Agent started at Port ${PORT}`);
});