import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", verifyJWT, logoutUser)

export default router