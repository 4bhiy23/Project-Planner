import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: String,
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
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

export const Task = new mongoose.model("Task", taskSchema)