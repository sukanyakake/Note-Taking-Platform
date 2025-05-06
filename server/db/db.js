import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error while connecting to MongoDB:", error.message);
    }
};

export default connectToMongoDB;
