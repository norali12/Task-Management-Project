import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/projects.route.js";
import taskRouter from "./routes/tasks.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;



app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/projects/:projectId/tasks", taskRouter);




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
})

export default app;
