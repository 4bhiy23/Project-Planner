import mongoose from "mongoose";
import dotenv from "dotenv";
import { Task } from "../src/models/taskModel.js";

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/Project_DB`);
    console.log("MongoDB connected for seeding tasks...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Dummy tasks data
const dummyTasks = [
  // Tasks for first milestone
  {
    title: "Setup GitHub repository",
    desc: "Initialize the repo, add README, and push starter code",
    status: "todo",
    milestoneID: "69a9397f98b9dbea1a245ba7",
    assignedTo: "69a940320403553d34bda7a3"
  },
  {
    title: "Create project skeleton",
    desc: "Setup folder structure and initial server code",
    status: "in-progress",
    milestoneID: "69a9397f98b9dbea1a245ba7",
    assignedTo: "69a9406f6bad8b2bc571949d"
  },
  {
    title: "Setup authentication",
    desc: "Implement signup, login, and JWT authentication",
    status: "todo",
    milestoneID: "69a9397f98b9dbea1a245ba7",
    assignedTo: "69a940786bad8b2bc57194a3"
  },
  {
    title: "Create landing page UI",
    desc: "Build homepage layout and styles",
    status: "done",
    milestoneID: "69a9397f98b9dbea1a245ba7",
    assignedTo: "69a92e7e5527afd17a9273a3"
  },

  // Tasks for second milestone
  {
    title: "Setup database models",
    desc: "Define schemas for Project, Milestone, Task, User",
    status: "in-progress",
    milestoneID: "69a937f901397da885af496c",
    assignedTo: "69a940320403553d34bda7a3"
  },
  {
    title: "Implement task APIs",
    desc: "CRUD endpoints for tasks",
    status: "todo",
    milestoneID: "69a937f901397da885af496c",
    assignedTo: "69a9406f6bad8b2bc571949d"
  },
  {
    title: "Implement milestone APIs",
    desc: "CRUD endpoints for milestones",
    status: "in-progress",
    milestoneID: "69a937f901397da885af496c",
    assignedTo: "69a940786bad8b2bc57194a3"
  },
  {
    title: "Setup frontend routing",
    desc: "React routing for projects and milestones",
    status: "todo",
    milestoneID: "69a937f901397da885af496c",
    assignedTo: "69a92e7e5527afd17a9273a3"
  }
];

// Seed tasks only
const seedTasks = async () => {
  try {
    await Task.insertMany(dummyTasks);
    console.log("Dummy tasks inserted ✅");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedTasks);