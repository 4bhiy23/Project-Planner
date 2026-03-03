import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      require: true
    },

    startDate: Date,
    endDate: Date,

    status: {
      type: String,
      enum: ["ONGOING", "COMPLETED", "DROPPED"],
      default: "ONGOING"
    },

    // The admin who created this project
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    milestones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone"
      }
    ]
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);