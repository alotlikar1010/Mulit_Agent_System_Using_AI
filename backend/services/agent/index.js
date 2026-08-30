import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js"
import router from "./routes/agent.route.js";
const PORT = process.env.PORT || 3000;
connectDB();

const app = express();
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Agent started at Port ${PORT}`);
});