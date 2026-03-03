import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
    },
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    milestoneID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

export const Task = new mongoose.Schema("Task", taskSchema)