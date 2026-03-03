import express from "express";
import {
    getAllProjects,
    createProject,
    addMembers,
    removeProjectLead,
    removeDev,
    deleteProject
} from "../controllers/admin.controller.js";
import { verifyJWT, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// -----------------------------
// Admin-only routes
// All routes require admin auth
// -----------------------------
router.use(verifyJWT, requireAdmin);

// GET all projects
// GET /api/v1/projects/admin
router.get("/", getAllProjects);

// CREATE a project
// POST /api/v1/projects/admin
router.post("/", createProject);

// ADD a member (dev) to a project
// POST /api/v1/projects/admin/add-member
router.post("/add-member", addMembers);

// REMOVE project lead (owner becomes new lead)
// PATCH /api/v1/projects/admin/remove-lead
router.patch("/remove-lead", removeProjectLead);

// REMOVE developer from a project
// PATCH /api/v1/projects/admin/remove-dev
router.patch("/remove-dev", removeDev);

// DELETE a project completely
// DELETE /api/v1/projects/admin/:projectID
router.delete("/:projectID", deleteProject);

export default router;