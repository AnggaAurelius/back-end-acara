import express from "express";
import betterAuthRoutes from "./auth.routes";
import protectedRoutes from "./protected.routes";

const router = express.Router();

// Better-Auth routes (new authentication system)
router.use("/auth", betterAuthRoutes);

// Protected routes demonstrating Better-Auth middleware usage
router.use("/protected", protectedRoutes);

// Legacy auth routes removed after Better-Auth migration

export default router;
