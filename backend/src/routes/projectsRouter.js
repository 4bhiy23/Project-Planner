import express from "express";
import { getMyProjects, getProjectByID } from "../controllers/project.controller.js";
import { verifyJWT, requireProjectLead, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// -----------------------------
// GET all projects of the logged-in user
// GET /api/v1/projects/my
// -----------------------------
router.get("/my", verifyJWT, getMyProjects);

// -----------------------------
// GET project by ID
// GET /api/v1/projects/:projectID
// -----------------------------
router.get("/:projectID", verifyJWT, getProjectByID);

// -----------------------------
// Optional future routes you can add
// -----------------------------
// router.post("/", verifyJWT, requireAdmin, createProject);
// router.patch("/:projectID", verifyJWT, requireProjectLead, updateProject);
// router.delete("/:projectID", verifyJWT, requireAdmin, deleteProject);
// router.get("/:projectID/members", verifyJWT, requireProjectLead, getProjectMembers);
// router.post("/:projectID/members", verifyJWT, requireProjectLead, addProjectMember);
// router.patch("/:projectID/members/:memberID", verifyJWT, requireProjectLead, updateMemberRole);
// router.delete("/:projectID/members/:memberID", verifyJWT, requireProjectLead, removeProjectMember);

export default router;