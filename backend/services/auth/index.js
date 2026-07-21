import express from "express";
import dotenv from "dotenv";
// import morgan from "morgan";
// import mongoose from "mongoose";
// import cors from "cors";

dotenv.config();

const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Auth started at Port ${PORT}`);
});