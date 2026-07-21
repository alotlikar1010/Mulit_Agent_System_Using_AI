import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
// import morgan from "morgan";
// import mongoose from "mongoose";
// import cors from "cors";

//xWxPp59AimAWeV1S
//alotlikar98_db_user

dotenv.config();

const app = express();

app.use("/auth", proxy(process.env.AUTH_SERVICE))

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Gateway started at Port ${PORT}`);
});