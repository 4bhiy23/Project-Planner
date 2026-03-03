import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

export const Milestones = mongoose.model("Milestones", milestoneSchema)