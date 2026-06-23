import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT;


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
})

export default app;
