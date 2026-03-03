import express from "express";
import { getMyProjects, getProjectByID } from "../controllers/project.controller.js";
import { verifyJWT, requireProjectLead, requireAdmin } from "../middleware/auth.middleware.js";
import { addMembers } from "../controllers/admin.controller.js";

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
// POST Add developer to project
// POST /api/v1/projects/:projectID/add-dev
// -----------------------------
// TODO: Test this endpoint
router.post("/:projectID/add-dev", requireProjectLead ,addMembers);

// -----------------------------
// Optional future routes you can add
// -----------------------------
// router.patch("/:projectID", verifyJWT, requireProjectLead, updateProject);
// router.get("/:projectID/members", verifyJWT, requireProjectLead, getProjectMembers);
// router.post("/:projectID/members", verifyJWT, requireProjectLead, addProjectMember);
// router.patch("/:projectID/members/:memberID", verifyJWT, requireProjectLead, updateMemberRole);
// router.delete("/:projectID/members/:memberID", verifyJWT, requireProjectLead, removeProjectMember);

export default router;