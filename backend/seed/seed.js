import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/userModel.js";
import { Project } from "../src/models/projectModel.js";
import { ProjectMember } from "../src/models/projectMemberModel.js";

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log("MongoDB connected for seeding...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Seed data
const seed = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("Database cleared");

    // --- Users ---
    const users = await User.create([
      { username: "Alice Admin", email: "admin@example.com", password: "password123", role: "admin" },
      { username: "Bob Lead", email: "lead@example.com", password: "password123", role: "user" },
      { username: "Charlie Dev", email: "dev1@example.com", password: "password123", role: "user" },
      { username: "Diana Dev", email: "dev2@example.com", password: "password123", role: "user" }
    ]);

    console.log("Users created");

    // --- Projects ---
    const projects = await Project.create([
      {
        title: "Project Alpha",
        description: "First project for testing",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "ONGOING",
        owner: users[0]._id
      },
      {
        title: "Project Beta",
        description: "Second project for testing",
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "ONGOING",
        owner: users[0]._id
      }
    ]);

    console.log("Projects created");

    // --- Project Members ---
    await ProjectMember.create([
      { projectID: projects[0]._id, userID: users[1]._id, role: "lead" },
      { projectID: projects[0]._id, userID: users[2]._id, role: "dev" },
      { projectID: projects[0]._id, userID: users[3]._id, role: "dev" },
      { projectID: projects[1]._id, userID: users[1]._id, role: "lead" },
      { projectID: projects[1]._id, userID: users[3]._id, role: "dev" }
    ]);

    console.log("Project members assigned");

    console.log("Seeding complete!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seed);