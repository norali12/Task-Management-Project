import mongoose from "mongoose";


export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const conn = await mongoose.connect(mongoURI)
        console.log(`MongoDB connected: ${conn.connection.name}`)

    } catch (error) {
        if (error instanceof Error) {
           console.error("MongoDB connection error:", error.message);
        }else{
           console.error("Unknown database error");
        }       
        
        process.exit(1)
    }
};