import mongoose from "mongoose";
import Project from "./project.model.js";
import User from "./user.model.js";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "Done"],
        default: "pending"
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    Priority:{
        type: String,
        enum: ["high", "medium", "low"],
        default: "medium"
    },
    dueDate:{
        type: Date,
        required: true
    },
    assignee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps:true
})

const Task = mongoose.model("Task", taskSchema);
export default Task;