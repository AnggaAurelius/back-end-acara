import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import betterAuthRoutes from "./auth.routes";
import protectedRoutes from "./protected.routes";

const router = express.Router();

// Better-Auth routes (new authentication system)
router.use("/auth", betterAuthRoutes);

// Protected routes demonstrating Better-Auth middleware usage
router.use("/protected", protectedRoutes);

// Legacy auth routes (keep for backward compatibility during transition)
// TODO: Remove these after migration is complete
router.post("/auth/legacy/register", authController.register);
router.post("/auth/legacy/login", authController.login);
router.get("/auth/legacy/me", authMiddleware, authController.me);
router.post("/auth/legacy/activation", authController.activation);

export default router;
