import mongoose from "mongoose";

const connectDb = async () => {
    try {

        await mongoose.connect(process.env.MONGODBURL)
        console.log("Connected to database");
    }
    catch (error) {
        console.log("Error while connecting to database");
        process.exit(1);
    }
}

export default connectDb;