import mongoose from "mongoose";
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
const connectDB = async () => {
    const url = process.env.MONGO_URI;
    if (!url) {
        throw new Error("MONGO_URI is not defined");
    }
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("error while connecting to mongoDB ", error);
        process.exit(1);
    }
};
export default connectDB;